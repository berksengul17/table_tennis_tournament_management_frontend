import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { register as registerParticipant } from "../../api/participantApi.ts";
import { useAgeCategory } from "../../context/AgeCategoryProvider.tsx";
import { ParticipantInputs } from "../../type";
import { emailRegex, participantInputsDefaultValues } from "../../utils.ts";
import RequiredLabel from "./components/RequiredLabel/index.tsx";
import styles from "./index.module.css";

const genderOptions = [
  { value: "0", label: "Erkek", categories: ["Erkek", "Karışık"] },
  { value: "1", label: "Kadın", categories: ["Kadın", "Karışık"] },
];

function RegisterPage() {
  const { categories, ageList } = useAgeCategory();
  // const [filteredCategories, setFilteredCategories] =
  //   useState<string[]>(categories);
  // const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState,
    formState: { isSubmitSuccessful, errors },
  } = useForm<ParticipantInputs>({
    defaultValues: participantInputsDefaultValues,
  });

  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/(\d{1,3})(\d{1,3})?(\d{1,2})?(\d{1,2})?/);
    if (match) {
      return [match[1], match[2], match[3], match[4]]
        .filter(Boolean)
        .join(" ")
        .trim();
    }
    return value;
  };

  // const handleGenderChange = async (e: any) => {
  //   const selectedGender = genderOptions.find(
  //     (option) => option.value === e.target.value
  //   );
  //   if (selectedGender) {
  //     setFilteredCategories(
  //       categories.filter((c) =>
  //         selectedGender.categories.some((category) => c.includes(category))
  //       )
  //     );

  //     // setAgeList(
  //     //   await getAgeListByCategoryAndGender(
  //     //     currentCategoryIndex,
  //     //     selectedGender.value
  //     //   )
  //     // );
  //   }
  // };

  // when birthdate change automatically update age category
  const handleBirthDateChange = (e: any) => {
    const age = calculateAge(e.target.value);

    for (let i = 0; i < ageList.length; i++) {
      const ageRange = ageList[i].split("-").map((a) => {
        if (a.includes("+")) {
          a = a.slice(0, -1);
        }

        return parseInt(a);
      });

      if (
        age >= ageRange[0] &&
        (ageRange[1] === undefined || age <= ageRange[1])
      ) {
        setValue("age", i.toString());
      }
    }
  };

  const calculateAge = (date: string) => {
    const today = new Date();
    const birthDate = new Date(date);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // If the current month is before the birth month or it's the birth month but the day hasn't passed yet, subtract 1 year
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const onSubmit: SubmitHandler<ParticipantInputs> = async (
    data: ParticipantInputs
  ) => {
    const newParticipant = await registerParticipant(data);
    if (newParticipant !== null) setShowSuccess(true);
  };

  useEffect(() => {
    const initializeCategories = async () => {
      // Simulate fetching categories if they are not readily available
      if (categories.length === 0) {
        // Simulate a delay to fetch categories
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      // setFilteredCategories(categories);
      setLoading(false);
    };
    initializeCategories();
  }, [categories]);

  // useEffect(() => {
  //   (async () => {
  //     const gender = getValues("gender");
  //     if (gender) {
  //       setAgeList(
  //         await getAgeListByCategoryAndGender(currentCategoryIndex, gender)
  //       );
  //     }
  //   })();
  // }, [currentCategoryIndex]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Kayıt Formu</h1>
      {isLoading ? (
        <div>Yükleniyor...</div>
      ) : (
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
            <input
              {...register("lastName", { required: true })}
              id="lastName"
            />
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
            <Controller
              name="phoneNumber"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  {...field}
                  id="phoneNumber"
                  type="tel"
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(handlePhoneChange(e.target.value))
                  }
                  pattern="[0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}"
                  placeholder="5XX XXX XX XX"
                />
              )}
            />
          </div>

          {/* <div className={styles.inputContainer}>
            <RequiredLabel
              htmlFor="phoneNumber"
              text="Telefon Numarası"
              required
            />
            <input
              {...register("phoneNumber", {
                required: true,
                onChange: (e) => handlePhoneChange(e.target.value),
              })}
              id="phoneNumber"
              type="tel"
              pattern="[0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}"
              placeholder="5XX XXX XX XX"
            />
          </div> */}

          <div className={styles.inputContainer}>
            <RequiredLabel htmlFor="gender" text="Cinsiyet" required />
            <div style={{ display: "flex" }}>
              {genderOptions.map((option) => (
                <div key={option.value} className={styles.radioContainer}>
                  <input
                    {...register("gender", {
                      required: true,
                    })}
                    type="radio"
                    id={option.value}
                    value={option.value}
                  />
                  <label htmlFor={option.value}>{option.label}</label>
                </div>
              ))}
            </div>
          </div>

          {/* <div className={styles.inputContainer}>
            <RequiredLabel htmlFor="category" text="Kategori" required />

            <select
              {...register("category", {
                required: true,
                onChange: (e) => {
                  setCurrentCategoryIndex(parseInt(e.target.value));
                },
              })}
              id="category"
            >
              {filteredCategories.map((category, index) => (
                <option key={index} value={index}>
                  {category}
                </option>
              ))}
            </select>
          </div> */}

          <div className={styles.inputContainer}>
            <RequiredLabel htmlFor="birthDate" text="Doğum Tarihi" required />
            <input
              {...register("birthDate", {
                required: true,
                onBlur: handleBirthDateChange,
              })}
              id="birthDate"
              type="date"
            />
          </div>

          {/* {filteredCategories[currentCategoryIndex]?.includes("Çift") && (
            <div className={styles.inputContainer}>
              <RequiredLabel htmlFor="pairName" text="Çift Adı" required />
              <input
                {...register("pairName", { required: true })}
                id="pairName"
              />
            </div>
          )} */}

          {/* <div className={styles.inputContainer}>
            <RequiredLabel htmlFor="ageCategory" text="Yaş Grubu" required />

            <select {...register("age", { required: true })} id="age">
              {ageList.map((age, index) => (
                <option key={index} value={index}>
                  {age}
                </option>
              ))}
            </select>
          </div> */}

          <div className={styles.inputContainer}>
            <RequiredLabel htmlFor="city" text="Katılınan Şehir" required />
            <input {...register("city", { required: true })} id="city" />
          </div>

          <div className={styles.feeInfo}>
            <p>❗Kayıt ücreti 650 TL'dir.</p>
            <p style={{ display: "flex" }}>
              <span>❗</span>
              <span style={{ display: "flex", flexDirection: "column" }}>
                Ücretler
                <span className={styles.bankInfo}>
                  Hesap Sahibi: Ahmet Bitirmiş
                </span>
                <span className={styles.bankInfo}>
                  İş Bankası: TR41 0006 4000 0013 4702 36 43 97
                </span>
                IBAN adresine yatırılabilir.
              </span>
            </p>
          </div>

          {showSuccess && (
            <p
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "red",
                textAlign: "center",
              }}
            >
              Başarılı bir şekilde kayıt oldunuz. Katılımcılar sekmesinden
              bilgilerinizi kontrol edebilirsiniz.
            </p>
          )}
          <button type="submit">Kaydol</button>
        </form>
      )}
    </div>
  );
}

export default RegisterPage;
