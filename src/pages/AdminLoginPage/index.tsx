import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import styles from "./index.module.css";

type LoginInputs = {
  username: string;
  password: string;
};

function AdminLoginPage() {
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<LoginInputs>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginInputs> = async (data: LoginInputs) => {
    if (login(data.username, data.password)) {
      navigate("/dashboard/manage-participants");
    }
  };

  useEffect(() => {
    console.log("admin", admin);
    if (admin !== null) {
      navigate("/dashboard/manage-participants");
    }
  }, [admin, navigate]);

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div>
          <label htmlFor="username">Username:</label>
          <input {...register("username", { required: true })} id="username" />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            {...register("password", { required: true })}
            id="password"
            type="password"
          />
        </div>

        <button type="submit">Giriş Yap</button>
      </form>
      <Outlet />
    </div>
  );
}

export default AdminLoginPage;
