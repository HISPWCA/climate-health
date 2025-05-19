import { useState } from "react";
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
  loadingProcessing,
  title,
  okText,
  handleOk,
  setSource,
  setDestination,
  source,
  destination,
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

  return open ? (
    <Modal onClose={handleClose} fluid>
      <ModalTitle>
        <div style={{ fontWeight: "bold", fontSize: "16px" }}>
          {title ? title : "Configuration des Méta données"}
        </div>
      </ModalTitle>
      <ModalContent>
        <div
          style={{
            padding: "20px",
            border: "1px solid #ccc",
          }}
        >
          <div style={{ width: "100%" }}>
            <div>
              <span style={{ fontWeight: "bold" }}>Meta data Source</span>
            </div>
            <div style={{ marginTop: "10px" }}>
              <DataDimension
                selectedDimensions={source ? [source] : []}
                onSelect={(value) => {
                  if (value.items.length <= 1) {
                    setSource(value.items[0]);
                  }
                }}
                displayNameProp="name"
              />
            </div>
          </div>
          {source && (
            <div style={{ width: "100%", marginTop: "30px" }}>
              <div>
                <span style={{ fontWeight: "bold" }}>
                  Meta data Destination
                </span>
              </div>
              <div style={{ marginTop: "10px" }}>
                <DataDimension
                  selectedDimensions={destination ? [destination] : []}
                  onSelect={(value) => {
                    if (value.items.length <= 1) {
                      setDestination(value.items[0]);
                    }
                  }}
                  displayNameProp="name"
                />
              </div>
            </div>
          )}
        </div>
      </ModalContent>
      <ModalActions>
        <ButtonStrip end>
          <Button
            loading={loadingProcessing || false}
            primary
            disabled={source || destination ? false : true}
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
