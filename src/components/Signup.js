import React, { useReducer, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import Button from "@material-ui/core/Button";
import { useAuth } from "../contexts/AuthContext";

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      display: "flex",
      flexWrap: "wrap",
      width: 400,
      margin: `${theme.spacing(0)} auto`
    },
    signupBtn: {
      marginTop: theme.spacing(2),
      flexGrow: 1
    },
    header: {
      textAlign: "center",
      background: "#212121",
      color: "#fff"
    },
    card: {
      marginTop: theme.spacing(10)
    }
  })
);

const initialState = {
  email: "",
  password: "",
  passwordconfirm: "",
  isButtonDisabled: true,
  helperText: "",
  isError: false
};


const reducer = (state, action) => {
  switch (action.type) {
    case "setEmail":
      return {
        ...state,
        email: action.payload
      };
    case "setPassword":
      return {
        ...state,
        password: action.payload
      };
    case "setPasswordConfirm":
      return {
        ...state,
        passwordconfirm: action.payload
      };
    case "setIsButtonDisabled":
      return {
        ...state,
        isButtonDisabled: action.payload
      };
    case "signupSuccess":
      return {
        ...state,
        helperText: action.payload,
        isError: false
      };
    case "signupFailed":
      return {
        ...state,
        helperText: action.payload,
        isError: true
      };
    case "setIsError":
      return {
        ...state,
        isError: action.payload
      };
    default:
      return state;
  }
};

const Signup = () => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { register, handleSubmit, errors, trigger } = useForm();

  useEffect(() => {
    if (state.password.trim() !== state.passwordconfirm.trim()) {
      //clearErrors()
      dispatch({
        type: "setIsButtonDisabled",
        payload: true
      });
    } else if (state.email.trim() && state.password.trim()) {
      dispatch({
        type: "setIsButtonDisabled",
        payload: false
      });
    } else {
      dispatch({
        type: "setIsButtonDisabled",
        payload: true
      });
    }
  }, [state.email, state.password, state.passwordconfirm]);

  async function handleSignup(data) {
    try {
      setError("");
      setSuccessMessage("");
      //sing up ボタンの無効s化
      dispatch({
        type: "setIsButtonDisabled",
        payload: true
      });
      await signup(state.email, state.passwordconfirm);
      dispatch({
        type: "signupSuccess",
        payload: "Signup Successfully"
      });
      //sing up ボタンの有効化
      dispatch({
        type: "setIsButtonDisabled",
        payload: false
      });
      setSuccessMessage("アカウントの作成に成功しました");
    } catch (e) {
      console.log(e);
      //エラーのメッセージの表示
      switch (e.code) {
        case "auth/network-request-failed":
          setError(
            "通信がエラーになったのか、またはタイムアウトになりました。通信環境がいい所で再度やり直してください。"
          );
          break;
        case "auth/weak-password": //バリデーションでいかないようにする
          setError("パスワードが短すぎます。6文字以上を入力してください。");
          break;
        case "auth/invalid-email": //バリデーションでいかないようにする
          setError("メールアドレスが正しくありません");
          break;
        case "auth/email-already-in-use":
          setError(
            "メールアドレスがすでに使用されています。ログインするか別のメールアドレスで作成してください"
          );
          break;
        case "auth/user-disabled":
          setError("入力されたメールアドレスは無効（BAN）になっています。");
          break;
        default:
          //想定外
          setError(
            "アカウントの作成に失敗しました。通信環境がいい所で再度やり直してください。"
          );
      }
      //sing up ボタンの有効化
      dispatch({
        type: "setIsButtonDisabled",
        payload: false
      });
    }
  }

  const handleKeyPress = (event) => {
    if (event.keyCode === 13 || event.which === 13) {
      if (!state.isButtonDisabled) {
        handleKeyPresstrigger();
        if (errors) {
          //errorメッセージを表示する
        } else {
          handleSignup();
        }
      }
    }
  };

  async function handleKeyPresstrigger() {
    const result = await trigger();
    return result;
  }

  const handleEmailChange = (
    event
  ) => {
    dispatch({
      type: "setEmail",
      payload: event.target.value
    });
  };

  const handlePasswordChange = (
    event
  ) => {
    dispatch({
      type: "setPassword",
      payload: event.target.value
    });
  };

  const handlePasswordConfirmChange = (
    event
  ) => {
    dispatch({
      type: "setPasswordConfirm",
      payload: event.target.value
    });
  };

  return (
    <form className={classes.container} noValidate autoComplete="off">
      <Card className={classes.card}>
        <CardHeader className={classes.header} title="Sign UP " />
        <CardContent>
          <div>
            {error && <div variant="danger">{error}</div>}
            {successMessage && <div variant="danger">{successMessage}</div>}
            <TextField
              error={state.isError}
              fullWidth
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="Email"
              margin="normal"
              onChange={handleEmailChange}
              onKeyPress={handleKeyPress}
              inputRef={register({
                pattern: /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/
              })}
            />
            {errors.email?.type === "pattern" && (
              <div style={{ color: "red" }}>
                メールアドレスの形式で入力されていません
              </div>
            )}


            <TextField
              error={state.isError}
              fullWidth
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Password"
              margin="normal"
              helperText={state.helperText}
              onChange={handlePasswordChange}
              onKeyPress={handleKeyPress}
            />
            {errors.password?.type === "minLength" && (
              <div style={{ color: "red" }}>
                パスワードは6文字以上で入力してください
              </div>
            )}

            <TextField
              error={state.isError}
              fullWidth
              id="password-confirm"
              type="password"
              label="Password-confirm"
              placeholder="Password-confirm"
              margin="normal"
              helperText={state.helperText}
              onChange={handlePasswordConfirmChange}
              onKeyPress={handleKeyPress}
            />
          </div>
          もしアカウントがあるなら Log In
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            className={classes.signupBtn}
            onClick={handleSubmit(handleSignup)}
            disabled={state.isButtonDisabled}
          >
            Signup
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

export default Signup;