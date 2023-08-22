// ** MUI Imports
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import Loader from '../Loader'
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
// ** Countries
import Countries from "utils/countries.json";

const DashboardTable = ({ trafficActivities, selectActivity, loaderShow }) => {
  const theme = useTheme()
  const flagShow = (countryName) => {
    const findCountryCode = Countries.find((country) => {
      if (country.name === countryName)
        return country.code
    })
    return findCountryCode?.code && getUnicodeFlagIcon(findCountryCode?.code)
  }
  const actionShow = (action) => {
    if (action === 'close') {
      return <CancelIcon color='error' />
    } else if (action === 'accept') {
      return <CheckIcon color='success' />
    } else if (action === 'deny') {
      return <DoDisturbAltIcon color='warning' />
    }
  }
  return (
    <>
      <TableContainer>
        <Table
          sx={{
            "& .MuiTableCell-head": {
              whiteSpace: "nowrap",
              paddingLeft: "8px",
              paddingRight: "8px",
            },
            "& .MuiTableCell-body": {
              paddingLeft: "8px",
              paddingRight: "8px",
            },
            "& .MuiTableCell-body": {
              paddingLeft: "8px",
              paddingRight: "8px",
            },
          }}
          aria-label="table in dashboard"
        >
          <TableHead>
            <TableRow>
              <TableCell>Deployment</TableCell>
              <TableCell>Cloud</TableCell>
              <TableCell>Region</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Source Name</TableCell>
              <TableCell>Destination name</TableCell>
              <TableCell>Source Country</TableCell>
              <TableCell>Destination Country</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Application</TableCell>
              <TableCell>Policy Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!trafficActivities?.length ? (
              <TableCell colSpan={13}>
                <Box
                  sx={{
                    position: "relative",
                    minHeight: "100px",
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {loaderShow && <Loader />}
                  No Data Found
                </Box>
              </TableCell>
            ) : (
              trafficActivities?.map((traffic, index) => {
                const dCountry = traffic.dstcountry.replace("%20", " ")
                const sCountry = traffic.srccountry.replace("%20", " ")
                return (
                  <TableRow
                    hover
                    key={index}
                    sx={{
                      "&:last-of-type td, &:last-of-type th": { border: 0 },
                    }}
                  >
                    <TableCell>{selectActivity.name}</TableCell>
                    <TableCell>{selectActivity.cloud}</TableCell>
                    <TableCell>{selectActivity.region}</TableCell>
                    <TableCell>{traffic.date}</TableCell>
                    <TableCell>{traffic.time}</TableCell>
                    <TableCell>{actionShow(traffic.action)}{traffic.action}</TableCell>
                    <TableCell>{traffic.srcip}</TableCell>
                    <TableCell>{traffic.dstip}</TableCell>
                    <TableCell>{flagShow(sCountry)}{sCountry}</TableCell>
                    <TableCell>{flagShow(dCountry)}{dCountry}</TableCell>
                    <TableCell>{traffic.service}</TableCell>
                    <TableCell>{traffic.dstinetsvc}</TableCell>
                    <TableCell>{traffic.policyname}</TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default DashboardTable
