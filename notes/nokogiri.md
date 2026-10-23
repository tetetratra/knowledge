---
tags: "Gem, HTML, XML, Nokogiri"
---

# nokogiri

- nokogiriのadd_childで、すでに存在する要素があるときに新規ではなく追加になってしまう
- 空のnodeset作れる
  - `Nokogiri::XML.NodeSet.new(Nokogiri::HTML.Document.new)`
- HUGEオプションとか、パースのオプション指定ができる
  - [Parsing an HTML/XML document Nokogiri](https://nokogiri.org/tutorials/parsing_an_html_xml_document.html#parse_options)
- rowspanを持っていないtdかrowspanを持っていないthに当てはまるセレクタ
  - `td:not([rowspan]),th:not([rowspan])`
