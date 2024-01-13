import * as yup from 'yup';

export const loginValidation = yup.object().shape({
  email: yup.string().required('メールアドレスは必須です。').email('有効なメールアドレスを入力してください。'),
  password: yup.string().required('パスワードは必須です。'),
});

export const registerValidation = yup.object().shape({
  email: yup.string().required('メールアドレスは必須です。').email('有効なメールアドレスを入力してください。'),
  password: yup.string().required('パスワードは必須です。').min(8, 'パスワードは8文字以上で入力してください。'),
  confirmPassword: yup
    .string()
    .required('確認用パスワードは必須です。')
    .oneOf([yup.ref('password'), ''], 'パスワードが一致しません。'),
  name: yup.string().required('表示名は必須です。'),
});

export const verifyEmailValidation = yup.object().shape({
  authCode: yup
    .string()
    .required('認証コードを入力してください。')
    .matches(/^[0-9]*$/, { message: '数字を入力してください。' }),
});
