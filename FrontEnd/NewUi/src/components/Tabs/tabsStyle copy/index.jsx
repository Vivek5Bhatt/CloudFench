// ** MUI Imports
import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useTheme } from "@mui/material/styles";
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

const TabsStyle = () => {
  const theme = useTheme();
  const [value, setValue] = React.useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
        <Box className="tab_content_box" sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}  >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="VPC/Subnet " value="1" />
                <Tab label="EC2" value="2" />
              <Tab label="Databases / Cache" value="3" />
              <Tab label="Discovered labels" value="4" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Box className="cstm_tree_structure">
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <Box className="cstm_tree_inner">
                    <ul className='cstm_tree_body'>
                      <li>
                        <Box>VPC-1</Box>
                        <ul>
                          <li>
                            <Box>Subnet1</Box>
                          </li>
                          <li>
                            <Box>Subnet2</Box>
                          </li>
                          <li>
                            <Box>Subnet3</Box>
                          </li>
                        </ul>
                      </li>
                        
                    </ul>
                  </Box>
                </Grid>
                <Grid item sm={6}>
                  <Box>sdsd</Box>
                </Grid>
             
              </Grid>
              </Box>
            </TabPanel>
            <TabPanel value="2">Item Two</TabPanel>
            <TabPanel value="3">Item Three</TabPanel>
            <TabPanel value="4">Item Three</TabPanel>
          </TabContext>
    </Box>
    </>
  );
};

export default TabsStyle;
