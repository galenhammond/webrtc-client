import React from "react";
import { useEffect } from "react";
import "./App.css";
import HomePage from "./pages/HomePage";
import NavbarContainer from "./components/navbar/NavbarContainer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FooterContainer from "./components/footer/FooterContainer";
import MeetingPage from "./pages/MeetingPage";
import { Provider } from "react-redux";
import GlobalStore from "./components/redux/Store";

function App() {
  var isLoading = true;

  useEffect(() => {}, []);

  isLoading = false;
  return (
    !isLoading && (
      <Provider store={GlobalStore}>
        <Router>
          <div className="">
            <main className="mx-8 flex-col h-full">
              <NavbarContainer />
              <Routes>
                <Route path={"/:meetingId"} element={<MeetingPage />} />
                <Route path={"/"} element={<HomePage />} />
              </Routes>
              <FooterContainer />
            </main>
          </div>
        </Router>
      </Provider>
    )
  );
}

export default App;
