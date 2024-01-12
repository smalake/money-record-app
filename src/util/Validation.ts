import * as yup from 'yup';

export const loginValidation = yup.object().shape({
  email: yup.string().required('メールアドレスは必須です。').email('有効なメールアドレスを入力してください。'),
  password: yup.string().required('パスワードは必須です。'),
});
