import React, { useState } from 'react';
import { Button, Card, Input, TabPanel, Badge, Modal } from '../index';

/**
 * ResponsiveExample component demonstrates how the library components 
 * can be used responsively across different screen sizes.
 */
const ResponsiveExample = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Tabs for the TabPanel
  const tabs = [
    {
      label: 'Dashboard',
      content: (
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Dashboard Content</h2>
          <p>This tab demonstrates responsive card layouts.</p>
          
          {/* Responsive grid of cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card 
                key={item}
                title={`Card ${item}`}
                hover={true}
              >
                <p>This card adjusts its width based on the screen size.</p>
                <div className="mt-4">
                  <Badge size="small">Item {item}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      label: 'Profile',
      content: (
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Profile Content</h2>
          <p>This tab demonstrates responsive form layouts.</p>
          
          {/* Responsive form layout */}
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="First Name" 
                name="firstName"
                placeholder="Enter your first name"
              />
              <Input 
                label="Last Name" 
                name="lastName"
                placeholder="Enter your last name"
              />
            </div>
            
            <Input 
              label="Email" 
              name="email"
              type="email"
              placeholder="Enter your email"
            />
            
            <Input 
              label="Bio" 
              name="bio"
              type="textarea"
              placeholder="Tell us about yourself"
            />
            
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
              <Button variant="secondary">Cancel</Button>
              <Button>Save Profile</Button>
            </div>
          </form>
        </div>
      )
    },
    {
      label: 'Settings',
      content: (
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Settings Content</h2>
          <p>This tab demonstrates responsive settings layouts.</p>
          
          {/* Responsive settings list */}
          <div className="space-y-4">
            {['Notifications', 'Privacy', 'Security', 'Appearance'].map((setting) => (
              <div key={setting} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg">
                <div className="mb-2 sm:mb-0">
                  <h3 className="font-medium">{setting}</h3>
                  <p className="text-sm text-gray-500">Manage your {setting.toLowerCase()} preferences</p>
                </div>
                <Button size="small" variant="outline">Configure</Button>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Responsive Component Examples</h1>
      
      {/* Responsive stack on mobile, row on desktop */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-xl font-semibold">Library Components</h2>
          <p className="text-gray-600">Examples of responsive behavior</p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button 
            variant="outline" 
            size="small"
            onClick={() => setIsModalOpen(true)}
          >
            Open Modal
          </Button>
          <Button size="small">
            Primary Action
          </Button>
        </div>
      </div>
      
      {/* TabPanel for responsive content */}
      <TabPanel 
        tabs={tabs}
        className="mb-8"
      />
      
      {/* Feature cards that stack on mobile */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Responsive Design', variant: 'primary' },
            { title: 'Accessible Components', variant: 'success' },
            { title: 'Customizable Themes', variant: 'info' },
            { title: 'Cross-Browser Support', variant: 'warning' }
          ].map((feature, index) => (
            <Card 
              key={index}
              padding="medium"
              hover={true}
            >
              <div className="flex flex-col items-center text-center">
                <Badge variant={feature.variant} size="large" className="mb-3">
                  Feature {index + 1}
                </Badge>
                <h3 className="font-medium">{feature.title}</h3>
                <p className="text-sm text-gray-500 mt-2">
                  This component adapts to different screen sizes
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Responsive form */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Contact Form</h2>
        <Card padding="medium">
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Name" 
                name="name"
                placeholder="Your name"
              />
              <Input 
                label="Email" 
                name="contactEmail"
                type="email"
                placeholder="Your email"
              />
            </div>
            
            <Input 
              label="Subject" 
              name="subject"
              placeholder="Message subject"
            />
            
            <Input 
              label="Message" 
              name="message"
              type="textarea"
              rows={5}
              placeholder="Your message"
            />
            
            <div className="flex flex-col xs:flex-row justify-end space-y-2 xs:space-y-0 xs:space-x-2">
              <Button fullWidth={true} className="xs:w-auto">
                Send Message
              </Button>
            </div>
          </form>
        </Card>
      </div>
      
      {/* Modal example */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Responsive Modal"
        size="medium"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>
              Confirm
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p>This modal is responsive and works on all screen sizes.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input 
              label="Username" 
              name="username"
              placeholder="Enter username"
            />
            <Input 
              label="Password" 
              name="password"
              type="password"
              placeholder="Enter password"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ResponsiveExample;
