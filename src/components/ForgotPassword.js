import React, { useReducer, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import Button from "@material-ui/core/Button";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      display: "flex",
      flexWrap: "wrap",
      width: 400,
      margin: `${theme.spacing(0)} auto`
    },
    forgotpasswordBtn: {
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

//state type

const initialState = {
  email: "",
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
    case "setIsButtonDisabled":
      return {
        ...state,
        isButtonDisabled: action.payload
      };
    case "forgotpasswordSuccess":
      return {
        ...state,
        helperText: action.payload,
        isError: false
      };
    case "forgotpasswordFailed":
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

const ForgotPassword = () => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { register, handleSubmit, errors, trigger } = useForm();

  useEffect(() => {
    if (state.email.trim()) {
      //trigger();
      dispatch({
        type: "setIsButtonDisabled",
        payload: false
      });
    } else {
      //clearErrors()
      dispatch({
        type: "setIsButtonDisabled",
        payload: true
      });
    }
  }, [state.email]);

  async function handleForgotPassword(data) {
    //react-hook-formを導入したためevent -> dataに変更
    //event.preventDefault();   //react-hook-formを導入したため削除

    try {
      setError("");
      setSuccessMessage("");
      //sing up ボタンの無効化
      dispatch({
        type: "setIsButtonDisabled",
        payload: true
      });

      await resetPassword(state.email);
      dispatch({
        type: "forgotpasswordSuccess",
        payload: "ForgotPassword Successfully"
      });

      //ForgotPassword ボタンの有効化
      dispatch({
        type: "setIsButtonDisabled",
        payload: false
      });
      setSuccessMessage("パスワードを初期化しました。");
      //history.push("/dashboard");
    } catch (e) {
      console.log(e);
      //エラーのメッセージの表示
      switch (e.code) {
        case "auth/network-request-failed":
          setError(
            "通信がエラーになったのか、またはタイムアウトになりました。通信環境がいい所で再度やり直してください。"
          );
          break;
        case "auth/invalid-email":
          setError("メールアドレスまたはパスワードが正しくありません");
          break;
        case "auth/wrong-password":
          setError("メールアドレスまたはパスワードが正しくありません");
          break;

        case "auth/user-disabled":
          setError("入力されたメールアドレスは無効（BAN）になっています。");
          break;
        default:
          //想定外
          setError(
            "処理に失敗しました。通信環境がいい所で再度やり直してください。"
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
          handleForgotPassword();
        }
      }
    }
  };

  async function handleKeyPresstrigger() {
    const result = await trigger();
    return result;
  }

  const handleEmailChange= (
    event
  ) => {
    dispatch({
      type: "setEmail",
      payload: event.target.value
    });
  };

  return (
    <form className={classes.container} noValidate autoComplete="off">
      <Card className={classes.card}>
        <CardHeader className={classes.header} title="ForgotPassword" />
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
          </div>
          もしアカウントがないなら<Link to="/signup">こちら</Link>
          からアカウントを作成してください。
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            className={classes.forgotpasswordBtn}
            onClick={handleSubmit(handleForgotPassword)}
            disabled={state.isButtonDisabled}
          >
            ForgotPassword
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

export default ForgotPassword;