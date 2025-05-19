import { useEffect, useState } from "react";
import {
  Button,
  ButtonStrip,
  Modal,
  ModalActions,
  ModalContent,
  ModalTitle,
} from "@dhis2/ui";
import { DataDimension } from "@dhis2/analytics";
import { FiSave } from "react-icons/fi";

const DHIS2DataModal = ({
  open,
  setOpen,
  onClose,
  initValues,
  title,
  okText,
  handleOk,
  loadingProcessing,
  numberOfSelection,
}) => {
  const [selectedMetaData, setSelectedMetaData] = useState([]);

  const handleClose = () => {
    setOpen(false);
    setSelectedMetaData([]);
    onClose && onClose();
  };

  const handleSave = () => {
    handleOk && handleOk(selectedMetaData);
  };

  useEffect(() => {
    if (initValues?.length > 0) {
      setSelectedMetaData(initValues);
    }
  }, [initValues]);

  return open ? (
    <Modal onClose={handleClose} large>
      <ModalTitle>
        <div style={{ fontWeight: "bold", fontSize: "16px" }}>
          {title ? title : "Méta données"}
        </div>
      </ModalTitle>
      <ModalContent>
        <div style={{ padding: "20px", border: "1px solid #ccc" }}>
          <DataDimension
            selectedDimensions={selectedMetaData}
            onSelect={(value) => {
              if (numberOfSelection) {
                if (value.items.length <= parseInt(numberOfSelection)) {
                  setSelectedMetaData(value.items || []);
                }
              } else {
                setSelectedMetaData(value.items || []);
              }
            }}
            displayNameProp="name"
          />
        </div>
      </ModalContent>
      <ModalActions>
        <ButtonStrip end>
          <Button
            loading={loadingProcessing || false}
            primary
            disabled={selectedMetaData.length === 0 ? true : false}
            onClick={handleSave}
            icon={<FiSave style={{ fontSize: "18px" }} />}
          >
            {okText ? okText : "Enrégistrer"}
          </Button>
        </ButtonStrip>
      </ModalActions>
    </Modal>
  ) : (
    <></>
  );
};

export default DHIS2DataModal;
