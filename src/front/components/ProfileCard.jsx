const ProfileCard = () => {
  return (
    <div className="container text-center mt-5">
      <img
        src="https://i.pravatar.cc/250/250"
        alt="User profile"
        className="rounded-circle mx-auto d-block mb-3"
      />
      <h3>John Doe</h3>
      <p className="text-muted">Runner</p>
      <p>Welcome to your profile page.</p>
    </div>
  );
};



export default ProfileCard;
