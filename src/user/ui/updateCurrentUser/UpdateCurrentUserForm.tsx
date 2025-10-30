import { useUpdateCurrentUserViewModel } from "./updateCurrentUser.view-model";
import { observer } from "mobx-react-lite";
import { Button } from "~/components/Button";
import { useTranslation } from "react-i18next";

const UpdateCurrentUserForm = observer(() => {
  const { register, onSubmit, formState, isLoading } = useUpdateCurrentUserViewModel();
  const { t } = useTranslation("user");
  
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
          {t("name", "Name")}
        </label>
        <input 
          id="name"
          placeholder={t("enter_your_name", "Enter your name")} 
          className="form-input"
          {...register("name")} 
        />
        {formState.errors.name && (
          <div className="form-error">{formState.errors.name.message}</div>
        )}
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          {t("email", "Email")}
        </label>
        <input 
          id="email"
          type="email"
          placeholder={t("enter_your_email", "Enter your email")} 
          className="form-input"
          {...register("email")} 
        />
        {formState.errors.email && (
          <div className="form-error">{formState.errors.email.message}</div>
        )}
      </div>
      
      <Button 
        type="submit" 
        loading={isLoading}
        className="w-full"
      >
        {t("update_profile", "Update Profile")}
      </Button>
    </form>
  );
});

export default UpdateCurrentUserForm;
