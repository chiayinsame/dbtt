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
import WorkoutsPage from "./pages/WorkoutsPage";
import BookingsPage from "./pages/BookingsPage";
import FriendsPage from "./pages/FriendsPage";
import FindPlayersPage from "./pages/FindPlayersPage";
import ClassesPage from "./pages/ClassesPage";
import LessonsPage from "./pages/LessonsPage";
import VenueSheet from "./components/venue/VenueSheet";
import BookModal from "./components/venue/BookingModal";

export default function App() {
  const { isDesktop } = useBreakpoint();
  const [scr, setScr] = useState("map");
  const [menu, setMenu] = useState(false);
  const [selV, setSelV] = useState(null);
  const [bookV, setBookV] = useState(null);
  const nav = id => { setSelV(null); setScr(id); };
  const goHome = () => nav("map");

  const pages = (
    <>
      {scr === "map"      && <MapPage onVenue={v => setSelV(v)} onMenu={() => setMenu(true)} />}
      {scr === "search"   && <SearchPage onBack={goHome} />}
      {scr === "profile"  && <ProfilePage onBack={goHome} />}
      {scr === "workouts" && <WorkoutsPage onBack={goHome} />}
      {scr === "bookings" && <BookingsPage onBack={goHome} />}
      {scr === "friends"  && <FriendsPage onBack={goHome} />}
      {scr === "players"  && <FindPlayersPage onBack={goHome} />}
      {scr === "classes"  && <ClassesPage onBack={goHome} />}
      {scr === "lessons"  && <LessonsPage onBack={goHome} />}
      {scr === "map" && selV && <VenueSheet venue={selV} onClose={() => setSelV(null)} onBook={v => { setSelV(null); setBookV(v); }} />}
      {menu && <MenuOverlay onClose={() => setMenu(false)} onNav={nav} />}
      {bookV && <BookModal venue={bookV} onClose={() => setBookV(null)} />}
    </>
  );

  if (isDesktop) {
    return (
      <div style={{display:"flex",height:"100%",width:"100%",background:$.bg,fontFamily:$.font,color:$.t1,overflow:"hidden"}}>
        <GlobalCSS />
        <BottomNav active={scr} onNav={nav} />
        <div style={{flex:1,position:"relative",overflow:"hidden"}}>
          {pages}
        </div>
      </div>
    );
  }

  return (
    <div style={{width:"100%",height:"100%",position:"relative",overflow:"hidden",fontFamily:$.font,color:$.t1,background:$.bg}}>
      <GlobalCSS />
      <StatusBar />
      {pages}
      <BottomNav active={scr} onNav={nav} />
    </div>
  );
}
