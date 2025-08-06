import { useUpdateCurrentUserViewModel } from "./updateCurrentUser.view-model";
import { observer } from "mobx-react-lite";
import { Button } from "~/components/Button";

const UpdateCurrentUserForm = observer(() => {
  const { register, onSubmit, formState, isLoading } = useUpdateCurrentUserViewModel();
  
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
          Name
        </label>
        <input 
          id="name"
          placeholder="Enter your name" 
          className="form-input"
          {...register("name")} 
        />
        {formState.errors.name && (
          <div className="form-error">{formState.errors.name.message}</div>
        )}
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Email
        </label>
        <input 
          id="email"
          type="email"
          placeholder="Enter your email" 
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
        Update Profile
      </Button>
    </form>
  );
});

export default UpdateCurrentUserForm;
