// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { useTheme } from "@mui/material/styles";

const CardSettings = (props) => {
  const theme = useTheme();
  // ** Props
  const { title, subtitle, color, icon, stats, trend, trendNumber, classBox, bgcolor } =
    props;

  return (
    <Card
      className={`inner_settingcard ${classBox}`}
      sx={{
        boxShadow: "none",
        borderRadius: "12px",
        minHeight: "100%",
        backgroundColor:bgcolor && bgcolor
      }}
    >
      <CardContent
        sx={{
          padding: "25px",
          [theme.breakpoints.down("sm")]: {
            padding: "15px",
          },
          "& .MuiTypography-root": {
            color: theme.palette.text.primary,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            marginBottom: 3,
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <Avatar
            src={icon}
            sx={{
              marginRight: 4,
              color: "common.white",
              backgroundColor: theme.palette.primary.contrastText,
              width: "40px",
              height: "40px",
              width: "60px",
              height: "60px",
              margin: "0 auto",
              borderRadius: "50%",
              [theme.breakpoints.down("sm")]: {
                width: "50px",
                height: "50px",
              },
              "& img": {
                width: "40px",
                objectFit: "contain",
                [theme.breakpoints.down("sm")]: {
                  width: "35px",
                },
              },
            }}
          ></Avatar>
        </Box>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "1rem",
            paddingBottom: "6px",
            textAlign: "center",
            [theme.breakpoints.down("sm")]: {
              fontSize: "0.9rem",
            },
          }}
        >
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CardSettings;

CardSettings.defaultProps = {
  color: "primary",
  trend: "positive",
};
