import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { register as registerParticipant } from "../../api/participantApi.ts";
import { ParticipantInputs } from "../../type";
import { emailRegex } from "../../utils.ts";
import RequiredLabel from "./components/RequiredLabel/index.tsx";
import styles from "./index.module.css";

function RegisterPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { isSubmitSuccessful, errors },
  } = useForm<ParticipantInputs>({
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "",
      email: "",
      phoneNumber: "",
      birthDate: "",
      ageCategory: "",
      city: "",
    },
  });

  const handlePhoneChange = (e: any) => {
    const length = e.target.value.length;
    if (length === 3 || length === 7 || length === 10) {
      e.target.value += " ";
    }
  };

  const onSubmit: SubmitHandler<ParticipantInputs> = async (
    data: ParticipantInputs
  ) => {
    await registerParticipant(data);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Kayıt Formu</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.inputContainer}>
          <RequiredLabel htmlFor="firstName" text="Adı" required />
          <input
            {...register("firstName", { required: true })}
            id="firstName"
          />
        </div>

        <div className={styles.inputContainer}>
          <RequiredLabel htmlFor="lastName" text="Soyadı" required />
          <input {...register("lastName", { required: true })} id="lastName" />
        </div>

        <div className={styles.inputContainer}>
          <RequiredLabel htmlFor="email" text="Email" required />
          <input
            {...register("email", {
              required: true,
              pattern: {
                value: emailRegex,
                message: "Geçerli bir email adresi giriniz.",
              },
            })}
            id="email"
          />
          {errors.email && (
            <p style={{ color: "red" }}>{errors.email.message}</p>
          )}
        </div>

        <div className={styles.inputContainer}>
          <RequiredLabel
            htmlFor="phoneNumber"
            text="Telefon Numarası"
            required
          />
          <input
            {...register("phoneNumber", {
              required: true,
              onChange: handlePhoneChange,
            })}
            id="phoneNumber"
            type="tel"
            pattern="[0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}"
            placeholder="5XX XXX XX XX"
          />
        </div>

        <div className={styles.inputContainer}>
          <RequiredLabel htmlFor="gender" text="Cinsiyet" required />
          <div style={{ display: "flex" }}>
            <div className={styles.radioContainer}>
              <input
                {...register("gender", { required: true })}
                type="radio"
                id="male"
                value="Erkek"
              />
              <label htmlFor="male">Erkek</label>
            </div>

            <div className={styles.radioContainer}>
              <input
                {...register("gender", { required: true })}
                type="radio"
                id="female"
                value="Kadın"
              />
              <label htmlFor="female">Kadın</label>
            </div>
          </div>
        </div>

        <div className={styles.inputContainer}>
          <RequiredLabel htmlFor="birthDate" text="Doğum Tarihi" required />
          <input
            {...register("birthDate", { required: true })}
            id="birthDate"
            type="date"
          />
        </div>

        <div className={styles.inputContainer}>
          <RequiredLabel htmlFor="ageCategory" text="Yaş Grubu" required />

          <select
            {...register("ageCategory", { required: true })}
            id="ageCategory"
          >
            <option value="0">40-49</option>
            <option value="1">50-59</option>
            <option value="2">60-69</option>
            <option value="3">70+</option>
          </select>
        </div>

        <div className={styles.inputContainer}>
          <RequiredLabel htmlFor="city" text="Katılınan Şehir" required />
          <input {...register("city", { required: true })} id="city" />
        </div>

        <input type="submit" value={"Kaydol"} />
      </form>
    </div>
  );
}

export default RegisterPage;
