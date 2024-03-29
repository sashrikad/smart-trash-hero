import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useContext } from "react";
import { withAuthenticator, WithAuthenticatorProps } from "@aws-amplify/ui-react";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { red } from "@mui/material/colors";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

function Topbar({ signOut, user }: WithAuthenticatorProps) {
  return (
    <Box display="flex" justifyContent="space-between" p={2} sx={{ backgroundColor: "#ffc107" }}>
      {/* SEARCH BAR */}
      <Box display="flex" borderRadius="3px" sx={{ mt: 2 }}>
        <Typography variant="h3">{user?.username}</Typography>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton onClick={signOut}>
          <PowerSettingsNewIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default withAuthenticator(Topbar);
