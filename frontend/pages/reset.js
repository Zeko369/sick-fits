import React from "react";
import ResetPassword from "../components/ResetPassword";

const resetPassword = (props) => <ResetPassword token={props.query.token} />;

export default resetPassword;
