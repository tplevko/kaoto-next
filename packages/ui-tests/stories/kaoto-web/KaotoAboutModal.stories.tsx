import { KaotoAboutModal } from '@kaoto/kaoto-web/testing';
import { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';

export default {
  title: 'KaotoWeb/KaotoAboutModal',
  component: KaotoAboutModal,
  argTypes: {
    isOpen: { control: 'boolean', description: 'Whether the modal is displayed' },
    onClose: { action: 'close', description: 'Called when the modal is closed' },
  },
} as Meta<typeof KaotoAboutModal>;

const Template: StoryFn<typeof KaotoAboutModal> = (args) => {
  const [isOpen, setIsOpen] = useState(args.isOpen);

  const handleClose = () => {
    args.onClose();
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Open About modal
      </button>
      <KaotoAboutModal {...args} isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export const AboutModal = Template.bind({});
AboutModal.args = {
  isOpen: true,
};
