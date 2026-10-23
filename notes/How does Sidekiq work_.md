---
tags: "Sidekiq, trap"
---

# How does Sidekiq work?

- https://www.mikeperham.com/how-sidekiq-works/
  - sidekiqが動く仕組みの解説記事
    - Sidekiq 7.2
    - Ruby 3.2
  - `bin/sidekiq` で起動する
    - https://github.com/sidekiq/sidekiq/blob/main/bin/sidekiq
  - メインループ
    - `self_read, self_write = IO.pipe`
      - (OSの)名無しパイプを作っている
      - 一般的に、親子プロセス間で通信するときにパイプが使われがち
    - `SIG{INT, TERM, TTIN, TSTP}` のハンドラを設定している
      - `Signal.trap(sig) do ~~~`
        - `sigaction`システムコール
        - [Signal. (Ruby 3.3 リファレンスマニュアル)](https://docs.ruby-lang.org/ja/latest/method/Signal/m/trap.html)
          - > trap は前回の trap で設定したハンドラを返します。文字列を登録していた場合はそれを、ブロックを登録していたらそれを Proc オブジェクトに変換して返します。
          - (こういうのはブロック引数として渡すほうが良いんじゃないのか...? )
      - 一見意味不明コード
        - 変数`old_handler`が未定義状態で使っているように見えるけれど、`Signal.trap(sig) do`定義時にはブロックは呼ばれていないので、ブロック評価時には定義されていてちゃんと動く
        - 既に登録済みのハンドラ(= `old_handler`)があれば(= `respond_to?(:call)`)、それを実行してからさっき作った無名パイプのwrite側(`self_write`)にシグナルを送る
**lib/sidekiq/cli.rb**

```
old_handler = Signal.trap(sig) do
  if old_handler.respond_to?(:call)
    begin
      old_handler.call
    rescue Exception => exc
      # signal handlers can't use Logger so puts only
      puts ["Error in #{sig} handler", exc].inspect
    end
  end
  self_write.puts(sig)
end
```

- `Sidekiq::Launcher`インスタンスを作って`run`する
- `while self_read.wait_readable`で、読み込み可能になる(= なにかシグナルが来る)までブロック (= 関数が戻ってこない) している
  - [IO#wait (Ruby 3.3 リファレンスマニュアル)](https://docs.ruby-lang.org/ja/latest/method/IO/i/wait_readable.html)
    - > self が読み込み可能になるまでブロックし、読み込み可能になったら真値を返します
**lib/sidekiq/cli.rb**

```
@launcher = Sidekiq::Launcher.new(@config)
begin
  launcher.run
  while self_read.wait_readable
    signal = self_read.gets.strip
    handle_signal(signal)
  end
```

- `handle_signal`で、受け取ったシグナルごとの処理をしている
  - 基本は`raise Interrupt`
```rb
    SIGNAL_HANDLERS = {
      # Ctrl-C in terminal
      "INT" => ->(cli) { raise Interrupt },
      # TERM is the signal that Sidekiq must exit.
      # Heroku sends TERM and then waits 30 seconds for process to exit.
      "TERM" => ->(cli) { raise Interrupt },
      "TSTP" => ->(cli) {
        cli.logger.info "Received TSTP, no longer accepting new work"
        cli.launcher.quiet
      },
...
    def handle_signal(sig)
      logger.debug "Got #{sig} signal"
      SIGNAL_HANDLERS[sig].call(self)
    end
```

- `Sidekiq::Launcher#run`側の処理
  - https://github.com/sidekiq/sidekiq/blob/main/lib/sidekiq/launcher.rb
  - `launcher <- 1:* -> manager <- 1:* -> worker(= processor)` の関係
  - launcher
**lib/sidekiq/launcher.rb**

```
def run
  @thread = safe_thread("heartbeat", &method(:start_heartbeat))
  @managers.each(&:start)
end
```

- 大本のスレッド`"heartbeat"`を作っている
- manager
**lib/sidekiq/manager.rb**

```
def start
  @workers.each(&:start)
end
```

- `workers`は`Processor`のインスタンスのリスト
- worker (processor)
**lib/sidekiq/processor.rb**

```
def start
  @thread ||= safe_thread("#{config.name}/processor", &method(:run))
end

...

def run
  Thread.current[:sidekiq_capsule] = @capsule
  process_one until @done
  ...
end

...

def process_one(&block)
  @job = fetch
  process(@job) if @job
  @job = nil
end

...
# fetchの奥の方はこんな感じの処理をしていた
# redisに繋いで取ってきている
# def retrieve_work
#   queue, job = redis { |conn| conn.blocking_call(TIMEOUT, "brpop", *qs, TIMEOUT) }
#   UnitOfWork.new(queue, job, config) if queue
# end

```

- 疲れたのでこのへんで中断。。。 (1/3目くらい)
