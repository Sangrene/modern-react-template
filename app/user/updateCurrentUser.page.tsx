import UpdateCurrentUserForm from "src/user/ui/updateCurrentUser/UpdateCurrentUserForm";

const UpdateCurrentUserPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-md mx-auto sm:max-w-lg lg:max-w-xl">
        <div className="bg-gray-800 shadow-lg rounded-lg px-8 py-6 border border-gray-700">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-100 mb-2">
              Update Profile
            </h1>
            <p className="text-gray-400">
              Update your personal information below.
            </p>
          </div>
          <UpdateCurrentUserForm />
        </div>
      </div>
    </div>
  );
};

export default UpdateCurrentUserPage;
