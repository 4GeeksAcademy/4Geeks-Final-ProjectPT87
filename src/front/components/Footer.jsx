export const Footer = () => (
  <footer className="footer mt-auto py-3">
    <div className="container d-flex justify-content-between align-items-center flex-wrap">
      <div>
        <h4>Running App</h4>
      </div>

      <div className="text-center">
        {/* <p className="mb-1">
          Check the{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://4geeks.com/docs/start/react-flask-template"
          >
            template documentation
          </a>{" "}
          <i className="fa-solid fa-file"></i> for help.
        </p> */}
        <p className="mb-0">
          Made with <i className="fa fa-heart text-danger" /> by Deony,
          Jonathan, Leonard, Ozzie, and Patrick
        </p>
      </div>
    </div>
  </footer>
);
