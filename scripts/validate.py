"""記事の形式、ローカル画像参照、明らかな機密情報パターンを検査する。"""
import hashlib
import json
import re
import sys
from pathlib import Path


def validate(root):
    errors = []
    images = set()
    notes = list((root / 'notes').rglob('*.md'))
    for path in notes:
        label = str(path.relative_to(root))
        text = path.read_text()
        if path.parent != root / 'notes':
            errors.append(f'{label}: 記事がフラットな配置ではない')
        parts = text.split('---', 2)
        if len(parts) != 3 or parts[0] or not parts[1].strip().startswith('tags: '):
            errors.append(f'{label}: frontmatterが不正')
            continue
        front = parts[1].strip()
        try:
            tags = json.loads(front.removeprefix('tags: '))
            if not isinstance(tags, str) or '\n' in front:
                raise ValueError()
            items = [x.strip() for x in tags.split(',') if x.strip()]
            if len(items) != len(set(items)):
                errors.append(f'{label}: タグに重複がある')
        except (ValueError, TypeError):
            errors.append(f'{label}: tagsはダブルクォート付き文字列にする')
        body = parts[2].strip()
        if re.search(r'^\s*(?:table|code):\S+', body, re.M):
            errors.append(f'{label}: Scrapboxのコード・表マーカーが未変換')
        if not body.startswith('# '):
            errors.append(f'{label}: 記事タイトルがない')
        prose, fence = [], None
        for line in body.splitlines():
            match = re.match(r'^\s*(`{3,}|~{3,})(.*)$', line)
            if fence:
                if match and match[1][0] == fence[0] and len(match[1]) >= len(fence) and not match[2].strip():
                    fence = None
                continue
            if match:
                fence = match[1]
                continue
            prose.append(re.sub(r'`+[^`]*`+', '', line))
        if fence:
            errors.append(f'{label}: コードフェンスが閉じていない')
        visible = '\n'.join(prose)
        if len(re.findall(r'^# ', visible, re.M)) != 1:
            errors.append(f'{label}: 記事タイトルの個数が不正')
        if re.search(r'<img\b', visible, re.I):
            errors.append(f'{label}: HTML画像タグを確認する必要がある')
        for target in re.findall(r'!\[[^\]]*\]\(([^)]+)\)', visible):
            if not re.fullmatch(r'\.\./assets/[a-f0-9]{64}\.[a-z0-9]+', target):
                errors.append(f'{label}: 画像はassetsの物理ファイルを相対参照する')
                continue
            asset = (path.parent / target).resolve()
            images.add(asset)
            if not asset.is_file():
                errors.append(f'{label}: 参照画像が存在しない')
        if '【画像取得失敗' in text or '【要確認' in text:
            errors.append(f'{label}: 未確認の下書きが残っている')
        if re.search(r'-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----', text):
            errors.append(f'{label}: 秘密鍵に似た値がある')
        if re.search(r'\bAKIA[A-Z0-9]{16}\b|\bgh[pousr]_[A-Za-z0-9]{30,}', text):
            errors.append(f'{label}: 認証情報に似た値がある')
    for asset in (root / 'assets').iterdir():
        if not asset.is_file():
            errors.append('assets: 予期しないサブディレクトリがある')
            continue
        if hashlib.sha256(asset.read_bytes()).hexdigest() != asset.stem:
            errors.append(f'assets/{asset.name}: 画像ハッシュが一致しない')
        if asset.resolve() not in images:
            errors.append(f'assets/{asset.name}: 未使用の画像がある')
    return notes, images, errors


if __name__ == '__main__':
    root = Path(__file__).resolve().parents[1]
    notes, images, errors = validate(root)
    if errors:
        print('\n'.join(errors))
        sys.exit(1)
    print(f'検査成功: 記事{len(notes)}件、参照画像{len(images)}件')
