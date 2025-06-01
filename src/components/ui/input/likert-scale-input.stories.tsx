// src/components/LikertScaleInput.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import LikertScaleInput from './likert-scale-input';

const meta: Meta<typeof LikertScaleInput> = {
  title: 'Components/LikertScaleInput',
  component: LikertScaleInput,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text', description: 'Name attribute for the radio group' },
    value: {
      control: { type: 'radio' },
      options: ['1', '2', '3', '4', '5'],
      description: 'Currently selected value',
    },
    onChange: { action: 'changed', description: 'Fired when selection changes' },
  },
};

export default meta;
type Story = StoryObj<typeof LikertScaleInput>;

export const Default: Story = {
  args: {
    name: 'likert',
    value: undefined,
  },
};

export const SelectedNeutral: Story = {
  args: {
    name: 'likert',
    value: 3,
  },
};
