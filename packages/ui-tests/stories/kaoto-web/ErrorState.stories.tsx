import { ErrorState } from '@kaoto/kaoto-web/testing';
import { Meta, StoryFn } from '@storybook/react';

export default {
  title: 'KaotoWeb/ErrorState',
  component: ErrorState,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    title: { control: 'text', description: 'Notification title' },
    message: { control: 'text', description: 'Notification message' },
    kind: { control: 'select', options: ['error', 'warning', 'info'], description: 'Notification kind' },
    onRetry: { action: 'retry', description: 'When provided, a Retry button is displayed' },
  },
} as Meta<typeof ErrorState>;

const Template: StoryFn<typeof ErrorState> = (args) => <ErrorState {...args} />;

export const Default = Template.bind({});
Default.args = {
  message: 'Failed to load the project files.',
};

export const WithRetry = Template.bind({});
WithRetry.args = {
  title: 'Connection lost',
  message: 'Unable to reach the server. Check your connection and try again.',
};

export const Warning = Template.bind({});
Warning.args = {
  title: 'Unsaved changes',
  message: 'Some changes could not be saved automatically.',
  kind: 'warning',
};

export const Info = Template.bind({});
Info.args = {
  title: 'Nothing to show',
  message: 'There are no integrations in this project yet.',
  kind: 'info',
};
