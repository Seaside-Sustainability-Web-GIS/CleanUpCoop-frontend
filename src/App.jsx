import { AppBar, Toolbar, Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Sidebar from '../Components/Sidebar.jsx';
import MapView from '../Components/Mapview.jsx';
import CollapsibleTable from "../Components/CollapsableTable.jsx";
import useStore from '../src/store/useStore';
import AuthForm from "../Components/AuthForm.jsx";
import useAuthStore from "../src/store/useAuthStore.js";

function App() {
    const mapCenter = useStore((state) => state.mapCenter); // Access state
    const setMapCenter = useStore((state) => state.setMapCenter); // Access actions
    const aboutOpen = useStore((state) => state.aboutOpen);
    const openAbout = useStore((state) => state.openAbout);
    const closeAbout = useStore((state) => state.closeAbout);
    const authOpen = useStore((state) => state.authOpen);
    const openAuth = useStore((state) => state.openAuth);
    const closeAuth = useStore((state) => state.closeAuth);
     const { isAuthenticated, logout } = useAuthStore();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        WebGIS Application Template
                    </Typography>
                    <Button color="inherit" onClick={() => window.location.reload()}>Home</Button>
                    <Button color="inherit" onClick={openAbout}>About</Button>
                    {/* Toggle between Sign in & Sign out */}
                    {isAuthenticated ? (
                        <Button color="inherit" onClick={logout}>
                            Sign out
                        </Button>
                    ) : (
                        <Button color="inherit" onClick={openAuth}>
                            Sign in
                        </Button>
                    )}
                </Toolbar>
            </AppBar>

            <Box sx={{ display: 'flex', flex: 1, position: 'relative' }}>
                <Sidebar setMapCenter={setMapCenter} />
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    <MapView mapCenter={mapCenter} style={{ flex: 1 }} />
                    <CollapsibleTable />
                </Box>
            </Box>

            {/* About Modal */}
            <Dialog open={aboutOpen} onClose={closeAbout}>
                <DialogTitle>About This Application</DialogTitle>
                <DialogContent>
                    <Typography>
                        This WebGIS application is designed to provide interactive mapping functionality for users.
                        You can explore geospatial data, interact with map layers, and use the tools provided in the
                        sidebar to customize your experience.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeAbout} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Sign-In Modal */}
            <Dialog open={authOpen} onClose={closeAuth}>
                <DialogTitle>Sign in</DialogTitle>
                <DialogContent>
                    <AuthForm />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeAuth} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default App;
