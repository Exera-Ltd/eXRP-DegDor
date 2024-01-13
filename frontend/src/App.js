import React, { useEffect, useCallback } from 'react';
import { Route, Link, Routes, Navigate } from 'react-router-dom';
import { UserOutlined, MedicineBoxOutlined, CalendarOutlined, AccountBookOutlined, PlusOutlined, AreaChartOutlined, ContainerOutlined, DollarCircleOutlined, DashboardOutlined, LogoutOutlined, FileExcelOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Layout, Menu, theme, ConfigProvider, Badge } from 'antd';
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
import Log from './pages/Logs/Log';

import './App.css';
import { appUrl } from './constants';
import { useUser } from './contexts/UserContext';
import Quotation from './pages/Quotations/Quotation';
import Report from './pages/Reports/Report';
import JobCardForm from './pages/JobCards/JobCardForm';
import JobCardListing from './pages/JobCards/JobCardListing';

const { Header, Content, Sider, Footer } = Layout;

const d = new Date();

const menu = [
  /* { key: 'dashboard', label: 'Dashboard', icon: React.createElement(DashboardOutlined), path: '/dashboard', roles: ['Administrator', 'Manager', 'Staff'] },*/
  { key: 'customers', label: 'Customers', icon: React.createElement(UserOutlined), path: '/customers', roles: ['Administrator', 'Manager', 'Staff'] },
  {
    key: 'prescription', label: 'Prescriptions', icon: React.createElement(MedicineBoxOutlined), path: '', roles: ['Administrator', 'Manager', 'Staff'], items: [
      { key: 'new-prescription', label: 'New', icon: React.createElement(PlusOutlined), path: '/new-prescription', roles: ['Administrator', 'Manager', 'Staff'] },
      { key: 'prescriptions', label: 'Prescriptions', icon: React.createElement(MedicineBoxOutlined), path: '/prescriptions', roles: ['Administrator', 'Manager', 'Staff'] }
    ]
  },
  {
    key: 'job-card', label: 'Job Cards', icon: React.createElement(ShoppingCartOutlined), path: '', roles: ['Administrator', 'Manager', 'Staff'], items: [
      { key: 'new-job-card', label: 'New', icon: React.createElement(PlusOutlined), path: '/job-card', roles: ['Administrator', 'Manager', 'Staff'] },
      { key: 'job-cards', label: 'Job Cards', icon: React.createElement(ShoppingCartOutlined), path: '/job-cards', roles: ['Administrator', 'Manager', 'Staff'] }
    ]
  },
  { key: 'appointments', label: 'Appointments', icon: React.createElement(CalendarOutlined), path: '/appointment', items: [], roles: ['Administrator', 'Manager', 'Staff'] },
  /* { key: 'inventory', label: 'Inventory', icon: React.createElement(ContainerOutlined), path: '/inventory', items: [], roles: ['Administrator', 'Manager', 'Staff'] },
  { key: 'invoices', label: 'Invoices', icon: React.createElement(AccountBookOutlined), path: '/invoices', items: [], roles: ['Administrator', 'Manager', 'Staff'] },
  { key: 'quotations', label: 'Quotations', icon: React.createElement(DollarCircleOutlined), path: '/quotations', items: [], roles: ['Administrator', 'Manager', 'Staff'] },
  { key: 'reports', label: 'Reports', icon: React.createElement(AreaChartOutlined), path: '/reports', items: [], roles: ['Administrator', 'Manager', 'Staff'] },
  { key: 'logs', label: 'Logs', icon: React.createElement(FileExcelOutlined), path: '/logs', items: [], roles: ['Administrator'] } */
]

const App = () => {
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#044254",
        colorInfo: "#044254",
        borderRadius: 5,
        colorBgContainer: '#000',
      },
    }}
  >
  </ConfigProvider>
  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async container => {
  }, []);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const renderNotificationIcon = () => {
    const icon = React.createElement(LogoutOutlined);
    return (
      <a href="/users/logout" style={{ fontSize: 22, color: '#fff', textDecoration: 'none' }}>
        {icon}
      </a>
    );
  }

  const { user, setUser } = useUser();

  useEffect(() => {
    fetch(appUrl + 'users/get_user')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setUser(data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [setUser]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          backgroundImage: 'linear-gradient(to right, #024550, #4ca1af)',
          padding: 0,
          margin: 0,
          display: 'flex',
        }}
      >
        <div className="header-logo" style={{ fontSize: 24 }}>Kler Vision</div>
        <div className="header-content">
          {renderNotificationIcon()}
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
          {
            user?.profile && user?.first_name !== "" &&
            <Badge.Ribbon text={user.profile.role} color="#024550">
              <div className="centered-title-div">
                Welcome<br />{user.first_name}
              </div>
            </Badge.Ribbon>
          }
          <Menu mode="inline" defaultSelectedKeys={['1']} style={{ borderRight: 0 }}>
            {menu.filter(item => !item.roles || item.roles.includes(user?.profile?.role)).map(item => {
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
                    enable: false,
                    mode: "push",
                  },
                  onHover: {
                    enable: false,
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
              <Route path="/job-card" element={<JobCardForm />} />
              <Route path="/job-cards" element={<JobCardListing />} />
              <Route path="/appointment" element={<Calendar />} />
              <Route path="/inventory" element={<NewProduct />} />
              <Route path="/invoices" element={<NewInvoice />} />
              <Route path="/quotations" element={<Quotation />} />
              <Route path="/reports" element={<Report />} />
              {user?.profile?.role === 'Administrator' && (
                <>
                  <Route path="/logs" element={<Log />} />
                </>
              )}
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