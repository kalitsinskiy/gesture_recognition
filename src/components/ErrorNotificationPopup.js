import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

const ErrorNotificationPopup = ({isOpen, toggle, title, message}) => (
    <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered
        modalTransition={{ timeout: 50 }}
    >
        <ModalHeader toggle={toggle}>{title}</ModalHeader>

        <ModalBody>{message}</ModalBody>

        <ModalFooter>
            <Button color="danger" onClick={toggle}>Got it</Button>
        </ModalFooter>
    </Modal>
);

export default ErrorNotificationPopup;
