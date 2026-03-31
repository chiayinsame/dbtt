import { useState } from "react";
import $ from "./theme/tokens";
import { useBreakpoint } from "./hooks/useBreakpoint";
import GlobalCSS from "./theme/GlobalStyles";
import StatusBar from "./components/nav/StatusBar";
import BottomNav from "./components/nav/BottomNav";
import MenuOverlay from "./components/nav/MenuOverlay";
import MapPage from "./pages/MapPage";
import SearchPage from "./pages/SearchPage";
import ProfilePage from "./pages/ProfilePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import BookingsPage from "./pages/BookingsPage";
import FriendsPage from "./pages/FriendsPage";
import FindPlayersPage from "./pages/FindPlayersPage";
import ClassesPage from "./pages/ClassesPage";
import LessonsPage from "./pages/LessonsPage";
import LockerPage from "./pages/LockerPage";
import VenueSheet from "./components/venue/VenueSheet";
import BookModal from "./components/venue/BookingModal";
import { USER } from "./data/mockData";

export default function App() {
  const { isDesktop } = useBreakpoint();
  const [screen, setScreen] = useState("map");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [bookingVenue, setBookingVenue] = useState(null);
  const [credits, setCredits] = useState(USER.activeSGCredits);

  const nav = id => { setSelectedVenue(null); setScreen(id); };
  const goHome = () => nav("map");

  const pages = (
    <>
      {screen === "map"         && <MapPage onVenue={v => setSelectedVenue(v)} onMenu={() => setMenuOpen(true)} />}
      {screen === "search"      && <SearchPage onBack={goHome} />}
      {screen === "profile"     && <ProfilePage onBack={goHome} credits={credits} onNav={nav} />}
      {screen === "leaderboard" && <LeaderboardPage onBack={goHome} />}
      {screen === "bookings"    && <BookingsPage onBack={goHome} />}
      {screen === "friends"     && <FriendsPage onBack={goHome} />}
      {screen === "players"     && <FindPlayersPage onBack={goHome} />}
      {screen === "classes"     && <ClassesPage onBack={goHome} />}
      {screen === "lessons"     && <LessonsPage onBack={goHome} />}
      {screen === "locker"      && <LockerPage onBack={goHome} credits={credits} setCredits={setCredits} />}
      {screen === "map" && selectedVenue && (
        <VenueSheet
          venue={selectedVenue}
          onClose={() => setSelectedVenue(null)}
          onBook={v => { setSelectedVenue(null); setBookingVenue(v); }}
        />
      )}
      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} onNav={nav} />}
      {bookingVenue && <BookModal venue={bookingVenue} onClose={() => setBookingVenue(null)} />}
    </>
  );

  if (isDesktop) {
    return (
      <div style={{ display: "flex", height: "100%", width: "100%", background: $.bg, fontFamily: $.font, color: $.t1, overflow: "hidden" }}>
        <GlobalCSS />
        <BottomNav active={screen} onNav={nav} credits={credits} />
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {pages}
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", fontFamily: $.font, color: $.t1, background: $.bg }}>
      <GlobalCSS />
      <StatusBar credits={credits} />
      {pages}
      <BottomNav active={screen} onNav={nav} />
    </div>
  );
}
