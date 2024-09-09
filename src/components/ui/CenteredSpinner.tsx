const CenteredSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative animate-spin rounded-full h-32 w-32 border-b-2 border-gray-500"></div>
    </div>
  );
};
export default CenteredSpinner;
