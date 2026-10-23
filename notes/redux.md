---
tags: "Redux, React Redux, Redux Actions, redux-form"
---

# redux

- `combineReducer`でreducerまとめたとき、キーのパスの箇所のstateがreducerの第一引数のstateに渡される
  - https://nakanisi-yusuke.gitbooks.io/react-basic-udemy/content/redux-no/combine-reducer.html
  - https://redux.js.org/recipes/structuring-reducers/using-combinereducers
- `combineReducer`では、combineしたreducer関数が扱うstateは、ネストされた場所に配置される
  - [combineReducersでハマったメモ - Qiita](https://qiita.com/usagi-f/items/ae568fb64c2eac882d05)
- `mapDispatchToProps = (dispatch, ownProps) => {}`の`ownProps`オプション引数
  - [Connect: Dispatching Actions with mapDispatchToProps | React Redux](https://react-redux.js.org/using-react-redux/connect-mapdispatch#defining-mapdispatchtoprops-as-a-function)
  - 第2引数の`ownProps`にはコンポーネントのpropsが渡されるから、これを使えばpropsが変化したときの再dispatchが自動で行われる。
  - mapDispatchToProps内で完結するのが嬉しみ
- **redux-actions**
  - `createActions`
    - 「節(枝へのパス)が大文字(SNAKE_CASE)のキー、葉が関数」の木構造のオブジェクトをこの関数にわたすと、「節(枝へのパス)が小文字(camelCase)のキー、葉が『アクションを返す関数』」な木構造のオブジェクトがかえる
    - https://redux-actions.js.org/api/createaction#createactionsactionmap-identityactions
- **redux-form**
  - 送信時のバリデーション
    - https://redux-form.com/6.5.0/examples/submitvalidation/
    - https://redux-form.com/6.5.0/docs/api/submissionerror.md/
    - `handleSubmit`にPromise的なものを渡す?
    - `throw new SubmissionError(label_name: error_message)` する。キーが空文字なら値がエラー文になる。
  - redux-formが管理しているreduxのstateは、`getFormValues(formName:String) returns (state) => formValues:Object`などを使ってアクセスすべし
    - `state.piyo.piyo2.piyo3..`のようにしてアクセスするのは避ける
    - [Redux Form - Selectors](https://redux-form.com/8.3.0/docs/api/selectors.md/#-code-getforminitialvalues-formname-string-code-returns-code-state-gt-forminitialvalues-object-code-)
