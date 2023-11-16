import React, { useCallback } from 'react';
import { Route, Link, Routes, Navigate } from 'react-router-dom';
import { UserOutlined, MedicineBoxOutlined, CalendarOutlined, AccountBookOutlined, PlusOutlined, AreaChartOutlined, ContainerOutlined, DollarCircleOutlined, DashboardOutlined } from '@ant-design/icons';
import { Layout, Menu, Typography, theme, ConfigProvider } from 'antd';
import { loadFull } from "tsparticles";

import NewCustomer from './pages/Customers/NewCustomer';
import CustomerListing from './pages/Customers/CustomerListing';
import PrescriptionListing from './pages/Prescriptions/PrescriptionListing';
import NewPrescription from './pages/Prescriptions/NewPrescription';
import Dashboard from './pages/Dashboard/Dashboard';
import Particles from "react-tsparticles";
import Calendar from './pages/Appointments/Calendar';
import NewProduct from './pages/Inventory/NewProduct';
import NewInvoice from './pages/Invoices/NewInvoice';

import './App.css';

const { Header, Content, Sider, Footer } = Layout;
const { Title } = Typography;

const d = new Date();

const menu = [
  { key: 'dashboard', label: 'Dashboard', icon: React.createElement(DashboardOutlined), path: '/dashboard' },
  { key: 'customers', label: 'Customers', icon: React.createElement(UserOutlined), path: '/customers' },
  {
    key: 'prescription', label: 'Prescriptions', icon: React.createElement(MedicineBoxOutlined), path: '', items: [
      { key: 'new-prescription', label: 'New', icon: React.createElement(PlusOutlined), path: '/new-prescription' },
      { key: 'prescriptions', label: 'Prescriptions', icon: React.createElement(MedicineBoxOutlined), path: '/prescriptions' }
    ]
  },
  { key: 'appointments', label: 'Appointments', icon: React.createElement(CalendarOutlined), path: '/appointment', items: [] },
  { key: 'inventory', label: 'Inventory', icon: React.createElement(ContainerOutlined), path: '/inventory', items: [] },
  { key: 'invoices', label: 'Invoices', icon: React.createElement(AccountBookOutlined), path: '/invoices', items: [] },
  { key: 'quotations', label: 'Quotations', icon: React.createElement(DollarCircleOutlined), path: '/quotations', items: [] },
  { key: 'reports', label: 'Reports', icon: React.createElement(AreaChartOutlined), path: '/reports', items: [] }
]

const App = () => {
  <ConfigProvider
    theme={{
      token: {
        // Seed Token
        colorPrimary: '#00b96b',
        borderRadius: 2,

        // Alias Token
        colorBgContainer: '#000',
      },
    }}
  >
  </ConfigProvider>
  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async container => {
    //await console.log(container);
  }, []);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          zIndex: 1,
          backgroundImage: 'linear-gradient(to right, #024550, #4ca1af)',
          padding: 0,
          margin: 0,
          display: 'flex',
        }}
      >
        <div className="demo-logo" >Kler Vision</div>
        <div style={{ display: 'flex', margin: '0 24px', flexGrow: 1}}>
          <div>This is some other texts</div>
          <div>This is some other logos</div>
        </div>
      </Header>
      <Layout>
        <Sider
          width={200}
          style={{
            background: colorBgContainer,
            zIndex: 1
          }}
        >
          <Title level={4} style={{ textAlign: 'center' }}>Welcome User</Title>
          <Menu mode="inline" defaultSelectedKeys={['1']} style={{ borderRight: 0 }}>
            {menu.map(item => {
              if (item.items && item.items.length > 0) {
                return (
                  <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                    {item.items.map(subItem => (
                      <Menu.Item key={subItem.key}>
                        <Link to={subItem.path}>
                          {subItem.icon} {subItem.label}
                        </Link>
                      </Menu.Item>
                    ))}
                  </Menu.SubMenu>
                );
              } else {
                return (
                  <Menu.Item key={item.key} icon={item.icon}>
                    <Link to={item.path}>{item.label}</Link>
                  </Menu.Item>
                );
              }
            })}
          </Menu>
        </Sider>
        <Layout
          style={{
            padding: '0 24px',
          }}
        >
          <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
              fpsLimit: 120,
              interactivity: {
                events: {
                  onClick: {
                    enable: true,
                    mode: "push",
                  },
                  onHover: {
                    enable: true,
                    mode: "repulse",
                  },
                  resize: true,
                },
                modes: {
                  push: {
                    quantity: 4,
                  },
                  repulse: {
                    distance: 200,
                    duration: 0.4,
                  },
                },
              },
              particles: {
                color: {
                  value: "#024550",
                },
                links: {
                  color: "#024550",
                  distance: 150,
                  enable: true,
                  opacity: 0.2,
                  width: 1,
                },
                collisions: {
                  enable: true,
                },
                move: {
                  directions: "none",
                  enable: true,
                  outModes: {
                    default: "bounce",
                  },
                  random: false,
                  speed: 1,
                  straight: false,
                },
                number: {
                  density: {
                    enable: true,
                    area: 800,
                  },
                  value: 80,
                },
                opacity: {
                  value: 0.5,
                },
                shape: {
                  type: "circle",
                },
                size: {
                  value: { min: 1, max: 5 },
                },
              },
              detectRetina: true,
            }}
          />
          <Content
            style={{
              padding: 24,
              margin: '24px 0px 0px 0px',
              height: '70vh',
              borderRadius: 10,
              background: colorBgContainer,
              boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 8px',
              overflowY: 'auto',
              zIndex: 1,
            }}
            className="scrollable-content"
          >
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/new-customer" element={<NewCustomer />} />
              <Route path="/customers" element={<CustomerListing />} />
              <Route path="/new-prescription" element={<NewPrescription />} />
              <Route path="/prescriptions" element={<PrescriptionListing />} />
              <Route path="/appointment" element={<Calendar />} />
              <Route path="/inventory" element={<NewProduct />} />
              <Route path="/invoices" element={<NewInvoice />} />
            </Routes>
          </Content>
          <Footer
            style={{
              textAlign: 'right',
              padding: '10px 0px'
            }}
          >
            Kler Vision © {d.getFullYear()} - Solution Designed by <a href='https://exera.mu?utm_source=optical-zone' target='_blank' rel="noreferrer">Exera</a>
          </Footer>
        </Layout>
      </Layout>
    </Layout >
  );
};
export default App;