import React, { useState, useEffect, useCallback } from 'react';
import { Route, Link, Routes, Navigate } from 'react-router-dom';
import { AccountBookOutlined, UserOutlined, MedicineBoxOutlined, CalendarOutlined, PlusOutlined, ContainerOutlined, DashboardOutlined, LogoutOutlined, ShoppingCartOutlined } from '@ant-design/icons';
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
import ProductListing from './pages/Inventory/ProductListing';
import InvoiceListing from './pages/Invoices/InvoiceListing';
import NewTransaction from './pages/Transactions/NewTransaction';
import TransactionListing from './pages/Transactions/TransactionListing';

const { Header, Content, Sider, Footer } = Layout;

const d = new Date();

const menu = [
  { key: 'dashboard', label: 'Dashboard', icon: React.createElement(DashboardOutlined), path: '/dashboard', roles: ['Super Admin'] },
  { key: 'customers', label: 'Customers', icon: React.createElement(UserOutlined), path: '/customers', roles: ['Super Admin', 'Executive', 'Staff'] },
  {
    key: 'transaction', label: 'Transactions', icon: React.createElement(MedicineBoxOutlined), path: '', roles: ['Super Admin', 'Executive', 'Staff'], items: [
      { key: 'new-transaction', label: 'New', icon: React.createElement(PlusOutlined), path: '/new-transaction', roles: ['Super Admin', 'Executive'] },
      { key: 'transactions', label: 'Transactions', icon: React.createElement(MedicineBoxOutlined), path: '/transactions', roles: ['Super Admin', 'Executive', 'Staff'] }
    ]
  },
  /* {
    key: 'job-card', label: 'Job Cards', icon: React.createElement(ShoppingCartOutlined), path: '', roles: ['Super Admin', 'Manager', 'Staff'], items: [
      { key: 'new-job-card', label: 'New', icon: React.createElement(PlusOutlined), path: '/job-card', roles: ['Super Admin', 'Manager', 'Staff'] },
      { key: 'job-cards', label: 'Job Cards', icon: React.createElement(ShoppingCartOutlined), path: '/job-cards', roles: ['Super Admin', 'Manager', 'Staff'] }
    ]
  }, */
  /* { key: 'job-cards', label: 'Job Cards', icon: React.createElement(ShoppingCartOutlined), path: '/job-cards', roles: ['Super Admin', 'Staff'] },
  { key: 'appointments', label: 'Appointments', icon: React.createElement(CalendarOutlined), path: '/appointment', items: [], roles: ['Super Admin', 'Staff', 'Executive'] }, */
  {
    key: 'product', label: 'Products', icon: React.createElement(ContainerOutlined), path: '', roles: ['Super Admin'], items: [
      { key: 'new-product', label: 'New Product', icon: React.createElement(ContainerOutlined), path: '/new-product', items: [], roles: ['Super Admin'] },
      { key: 'inventory', label: 'Inventory', icon: React.createElement(ContainerOutlined), path: '/inventory', items: [], roles: ['Super Admin'] },
    ]
  },
  /* {
    key: 'invoice', label: 'Invoices', icon: React.createElement(AccountBookOutlined), path: '', roles: ['Super Admin', 'Staff'], items: [
      { key: 'new-invoice', label: 'New Invoices', icon: React.createElement(MedicineBoxOutlined), path: '/new-invoice', roles: ['Super Admin', 'Staff'] },
      { key: 'invoices', label: 'Invoices', icon: React.createElement(MedicineBoxOutlined), path: '/invoices', roles: ['Super Admin', 'Staff'] }
    ]
  }, */
  /*{ key: 'quotations', label: 'Quotations', icon: React.createElement(DollarCircleOutlined), path: '/quotations', items: [], roles: ['Super Admin', 'Manager', 'Staff'] },
  { key: 'reports', label: 'Reports', icon: React.createElement(AreaChartOutlined), path: '/reports', items: [], roles: ['Super Admin', 'Manager', 'Staff'] },
  { key: 'logs', label: 'Logs', icon: React.createElement(FileExcelOutlined), path: '/logs', items: [], roles: ['Super Admin'] } */
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
  const { userRoles, setUserRoles } = useUser([]);
  const [appConfig, setAppConfig] = useState(
    {
      "name": "",
      "logo": "",
      "primaryColor": "#fff",
      "secondaryColor": "#fff",
      "utmSource": "eXRP"
    }
  );

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

  useEffect(() => {
    fetch(appUrl + 'users/roles')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setUserRoles(data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [])

  useEffect(() => {
    console.log(appConfig);
    fetch(appUrl + 'app_config/business')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.length > 0) {
          setAppConfig(data[0]);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, [])

  const hexToRgb = (hex, alpha) => {
    const hexValue = hex.replace('#', '');
    const r = parseInt(hexValue.substring(0, 2), 16);
    const g = parseInt(hexValue.substring(2, 4), 16);
    const b = parseInt(hexValue.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  useEffect(() => {
    // Update the CSS rule dynamically
    const styleElement = document.createElement('style');
    const rgbaColor = hexToRgb(appConfig.secondaryColor, 0.3);
    styleElement.innerHTML = `
      a:hover {
          color: ${appConfig.secondaryColor};
      }
      .ant-btn-primary {
        background-color: ${appConfig.primaryColor};
      }
      .ant-btn-primary:not(:disabled):not(.ant-btn-disabled):hover {
        background-color: ${appConfig.secondaryColor};
      }
      .ant-btn-primary:not(:disabled):not(.ant-btn-disabled):focus {
        background-color: ${appConfig.primaryColor};
      }
      .ant-select-outlined:not(.ant-select-disabled):not(.ant-select-customize-input):not(.ant-pagination-size-changer):hover .ant-select-selector{
        border-color: ${appConfig.secondaryColor};
      }
      .ant-select-focused{
        border-color: ${appConfig.primaryColor};
      }
      .ant-btn-primary:active:hover {
        background-color: ${appConfig.secondaryColor};
      }
      .ant-picker-outlined:hover{
        border-color: ${appConfig.secondaryColor};
      }
      .ant-input-outlined:hover, .ant-input-outlined:focus{
        border-color: ${appConfig.secondaryColor};
      }
      .ant-select-selection-search-input:hover, .ant-select-selection-search-input:focus{
        border-color: ${appConfig.secondaryColor};
      }

      .ant-menu-light .ant-menu-item-selected, .ant-menu-light .ant-menu-submenu-selected >.ant-menu-submenu-title{
        color: ${appConfig.primaryColor};
        background-color: ${rgbaColor};
      }

      .scrollable-content::-webkit-scrollbar-thumb {
        background-color: ${appConfig.primaryColor};
      }
      .scrollable-content::-webkit-scrollbar-thumb:hover {
        background-color:  ${appConfig.secondaryColor};
      }
      .custom-ribbon .ant-ribbon {
        background-color: ${appConfig.primaryColor};
      }
      
      .custom-ribbon .ant-ribbon-content {
        border-color: ${appConfig.primaryColor};
      }
    `;

    // Remove any existing dynamically generated styles
    const existingStyleElements = document.querySelectorAll('style[data-dynamic-style="scrollbar"]');
    existingStyleElements.forEach(element => {
      element.parentNode.removeChild(element);
    });

    // Add a data attribute to identify this dynamically generated style
    styleElement.setAttribute('data-dynamic-style', 'scrollbar');

    // Append the new dynamic style element to the document's head
    document.head.appendChild(styleElement);
  }, [appConfig]);


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{
        backgroundImage: `linear-gradient(to left, ${appConfig.primaryColor}, ${appConfig.secondaryColor})`,
        padding: 0,
        margin: 0,
        display: 'flex'
      }} >
        <div className="header-logo" style={{ fontSize: 24, height: 57 }}><img style={{ height: '100%', objectFit: 'cover', textAlign: 'center', marginTop: 2 }} src={appConfig.logo} alt={appConfig.name} /></div>
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
          {user?.profile && user?.first_name !== "" && user.profile.roles.length > 0 && (
            <Badge.Ribbon text={user.profile.roles[0]} color={appConfig.primaryColor}>
              <div className="centered-title-div">
                Welcome<br />{user.first_name}
              </div>
            </Badge.Ribbon>
          )}


          <Menu mode="inline" defaultSelectedKeys={['1']} style={{ borderRight: 0 }}>
            {menu.filter(item => !item.roles || item.roles.includes(user?.profile?.roles[0])).map(item => {
              if (item.items && item.items.length > 0) {
                return (
                  <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                    {item.items.filter(subItem => !subItem.roles || subItem.roles.includes(user?.profile?.roles[0])).map(subItem => (
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
          <div style={{ padding: '10px', textAlign: 'center' }}>
            <span className='footer-exrp-logo'>eXRP</span><br />
            <span>v1.0</span>
          </div>
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
                  value: appConfig.primaryColor,
                },
                links: {
                  color: appConfig.primaryColor,
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
              <Route path="/new-transaction" element={<NewTransaction />} />
              <Route path="/transactions" element={<TransactionListing />} />
              <Route path="/job-card" element={<JobCardForm />} />
              <Route path="/job-cards" element={<JobCardListing />} />
              <Route path="/appointment" element={<Calendar />} />
              <Route path="/new-product" element={<NewProduct />} />
              <Route path="/inventory" element={<ProductListing />} />
              <Route path="/new-invoice" element={<NewInvoice />} />
              <Route path="/invoices" element={<InvoiceListing />} />
              <Route path="/quotations" element={<Quotation />} />
              <Route path="/reports" element={<Report />} />
              {user?.profile?.roles[0] === 'Super Admin' && (
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
            {appConfig.name} © {d.getFullYear()} - Solution Designed by <a className='footer-exera-logo' href={`https://exera.mu?utm_source=${appConfig.utmSource}`} target='_blank' rel="noreferrer">exera</a>
          </Footer>
        </Layout>
      </Layout>
    </Layout >
  );
};
export default App;