import React from 'react';
import { Route, Link, Routes } from 'react-router-dom';
import { UserOutlined, MedicineBoxOutlined, CalendarOutlined, AccountBookOutlined, PlusOutlined, AreaChartOutlined, ContainerOutlined, DollarCircleOutlined, DashboardOutlined } from '@ant-design/icons';
import { Layout, Menu, Typography, theme } from 'antd';
import NewCustomer from './pages/Customers/NewCustomer';
import './App.css';
import CustomerListing from './pages/Customers/CustomerListing';
import PrescriptionListing from './pages/Prescriptions/PrescriptionListing';
import NewPrescription from './pages/Prescriptions/NewPrescription';
import Dashboard from './pages/Dashboard/Dashboard';

const { Header, Content, Sider, Footer } = Layout;
const { Title } = Typography;

const d = new Date();

const menu = [
  /* {
    key: 'customer', label: 'Customers', icon: React.createElement(UserOutlined), path: '', items: [
      { key: 'new-customer', label: 'Add New Customer', icon: React.createElement(UserOutlined), path: '/new-customer' },
      { key: 'customer-listing', label: 'Customer Listing', icon: React.createElement(UserOutlined), path: '/customer-listing' }
    ]
  }, */
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
  { key: 'purchase-orders', label: 'Purchase Orders', icon: React.createElement(DollarCircleOutlined), path: '/purchase-orders', items: [] },
  { key: 'reports', label: 'Reports', icon: React.createElement(AreaChartOutlined), path: '/reports', items: [] }
]

const App = () => {

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="demo-logo" >Optical Zone Ltd</div>
      </Header>
      <Layout>
        <Sider
          width={200}
          style={{
            background: colorBgContainer,
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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/new-customer" element={<NewCustomer />} />
              <Route path="/customers" element={<CustomerListing />} />
              <Route path="/new-prescription" element={<NewPrescription />} />
              <Route path="/prescriptions" element={<PrescriptionListing />} />
            </Routes>
          </Content>
          <Footer
            style={{
              textAlign: 'right',
              padding: '10px 0px'
            }}
          >
            Optical Zone © {d.getFullYear()} - Solution Design by <a href='https://exera.mu?utm_source=optical-zone' target='_blank' rel="noreferrer">Exera</a>
          </Footer>
        </Layout>
      </Layout>
    </Layout >
  );
};
export default App;