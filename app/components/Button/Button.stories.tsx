import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants, sizes, and states.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'text'],
      description: 'The visual style variant of the button',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'The size of the button',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Shows a loading spinner and disables the button',
    },
    success: {
      control: { type: 'boolean' },
      description: 'Applies success styling (green)',
    },
    error: {
      control: { type: 'boolean' },
      description: 'Applies error styling (red)',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disables the button',
    },
    children: {
      control: { type: 'text' },
      description: 'The content inside the button',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

// Variants
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Text: Story = {
  args: {
    variant: 'text',
    children: 'Text Button',
  },
};

// Sizes
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium Button',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

// States
export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading Button',
  },
};

export const Success: Story = {
  args: {
    success: true,
    children: 'Success Button',
  },
};

export const Error: Story = {
  args: {
    error: true,
    children: 'Error Button',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

// Interactive loading example
export const InteractiveLoading: Story = {
  render: () => {
    const [loading, setLoading] = useState(false);

    const handleClick = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
    };

    return (
      <Button loading={loading} onClick={handleClick}>
        Click to Load
      </Button>
    );
  },
};

// Combined states
export const LoadingSuccess: Story = {
  args: {
    loading: true,
    success: true,
    children: 'Loading Success',
  },
};

export const LoadingError: Story = {
  args: {
    loading: true,
    error: true,
    children: 'Loading Error',
  },
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="text">Text</Button>
    </div>
  ),
};

// All sizes showcase
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

// All states showcase
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button>Normal</Button>
      <Button loading>Loading</Button>
      <Button success>Success</Button>
      <Button error>Error</Button>
      <Button disabled>Disabled</Button>
    </div>
  ),
};

// Complex example with form
export const FormExample: Story = {
  render: () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const handleSubmit = async () => {
      setLoading(true);
      setSuccess(false);
      setError(false);

      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        // Randomly show success or error
        if (Math.random() > 0.5) {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 2000);
        } else {
          setError(true);
          setTimeout(() => setError(false), 2000);
        }
      }, 1500);
    };

    return (
      <div className="space-y-4">
        <div className="text-gray-300 text-sm">
          This example simulates a form submission with loading, success, and error states.
        </div>
        <Button
          loading={loading}
          success={success}
          error={error}
          onClick={handleSubmit}
          disabled={loading || success || error}
        >
          {success ? 'Success!' : error ? 'Error!' : 'Submit Form'}
        </Button>
      </div>
    );
  },
}; 