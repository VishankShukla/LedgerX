import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { useAuth } from "../context/AuthContext";

export default function AuthForm({ mode }){
    const isLogin = mode === "login";
    const { user, login, register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({ name:"", email:"", password:""});
    const [busy, setBusy] = useState(false);

    if(user) return <Navigate to="/" replace/>;

    const onChange = (e) => setForm({...form, [e.target.name] : e.target.value});

    const onSubmit = async (e) => {
        e.preventDefault();
        if(form.password.length < 6 ) return toast.error("Password Length Minimum 6");
        setBusy(true);
        try{
            isLogin ? await login(form) : await register(form);
            navigate(location?.state?.from?.pathname || "/" , { replace : true});
        } catch(e) {
            console.log("REGISTER ERROR:", e);
            toast.error(e.userMessage);
        } finally {
            setBusy(false);
        }
    };

    return(
        <div className="auth-wrap">
            <form className="card form" onSubmit={onSubmit}>
                <h1>{isLogin ? "Welcome back" : "Create account"}</h1>
                {!isLogin && (
                    <label>Name<input name="name" value={form.name} onChange={onChange} required /></label>
                )}
                <label>Email<input type="email" name="email" value={form.email} onChange={onChange} required /></label>
                <label>Password<input type="password" name="password" value={form.password} onChange={onChange} required /></label>
                <button className="btn" disabled={busy}>{busy ? "Please wait…" : isLogin ? "Login" : "Register"}</button>
                <p className="muted">
                    {isLogin ? "New here? " : "Already registered? "}
                    <Link to={isLogin ? "/register" : "/login"}>{isLogin ? "Register" : "Login"}</Link>
                </p>
            </form>
        </div>
    )


}