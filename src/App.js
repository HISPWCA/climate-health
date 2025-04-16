import { Button } from "@dhis2/ui";
import { useConfig } from "@dhis2/app-runtime";

import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from "react";
import { DatePicker, Select, Spin, Row, Col, Modal } from "antd";

import ChartBuilder from "./ChartBuilder";
import { uniqByProp } from "./utils/uniqByProp";
import { listMonths } from "./utils/listMonths";
import { peaks_tranches } from "./utils/peaks_tranches";
import { ObjectToTable } from "./components/ObjectToTable";
import { consecutivePeaks } from "./utils/consecutivePeaks";
import { calculerPourcentage } from "./utils/calculerPourcentage";
import { IoSettings } from "react-icons/io5";

import "./output.css";
import { injectDataToTarget } from "./utils/injectDataToTarget";

// const precipitation_DataElement = "Rl85S6SUvUz";
// const target_DataElement = "ERg2DkAF3ka";

const uniqueById = uniqByProp("ouId");

const App = () => {
  const { baseUrl } = useConfig();

  const [loading, setLoading] = useState(false);

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedLevels, setSelectedLevels] = useState("");

  const [levels, setLevels] = useState([]);
  const [peaksData, setPeaksData] = useState([]);
  const [organisationUnits, setOrganisationUnits] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [indicators, setIndicators] = useState([]);
  const [dataElements, setDataElements] = useState([]);

  const [precipitation_DataElement, setPrecipitation_DataElement] =
    useState(null);
  const [target_DataElement, setTarget_DataElement] = useState(null);

  const loadSettings = () => {
    axios
      .get(`${baseUrl}/api/dataStore/climate_health/settings`)
      .then((response) => {
        console.log("response : ", response.data);
        setPrecipitation_DataElement(response.data?.indicator);
        setTarget_DataElement(response.data?.datElement);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const loadIndicators = () => {
    axios
      .get(`${baseUrl}/api/indicators.json?paging=false&fields=id,displayName`)
      .then((response) => {
        setIndicators(response.data.indicators);
      })
      .catch((error) => {
        setIndicators([]);

        console.log(error.message);
      });
  };

  const loadDataElements = () => {
    axios
      .get(
        `${baseUrl}/api/dataElements.json?paging=false&fields=id,displayName`
      )
      .then((response) => {
        setDataElements(response.data.dataElements);
      })
      .catch((error) => {
        setDataElements([]);

        console.log(error.message);
      });
  };

  const loadOULevels = () => {
    axios
      .get(`${baseUrl}/api/organisationUnitLevels.json?paging=false`)
      .then((response) => {
        setLevels(response.data.organisationUnitLevels);
      })
      .catch((error) => {
        setLevels([]);

        console.log(error.message);
      });
  };

  const loadOrganisationUnits = () => {
    axios
      .get(`${baseUrl}/api/organisationUnits.json?paging=false`)
      .then((response) => {
        setOrganisationUnits(response.data.organisationUnits);
      })
      .catch((error) => {
        setOrganisationUnits([]);

        console.log(error.message);
      });
  };

  useEffect(() => {
    loadOULevels();
    loadDataElements();
    loadIndicators();
    loadSettings();
    loadOrganisationUnits();
  }, []);

  const onYearSelectionChange = (_, dateString) => setSelectedYear(dateString);

  const onLevelsSelected = (value) => setSelectedLevels(value);

  const loadPeaksData = async () => {
    try {
      setLoading(true);
      setPeaksData([]);

      const keys = Object.keys(peaks_tranches);
      const tmpPeaksData = [];
      function getMoisDeAnnee(annee) {
        const mois = [];
        for (let i = 1; i <= 12; i++) {
            // Formatage du mois sur 2 chiffres (01, 02, ..., 12)
            const moisFormate = i.toString().padStart(2, '0');
            mois.push(`${annee}${moisFormate}`);
        }
        return mois;
    }
      for (const currentTranche of keys) {
        const trancheActuelle = peaks_tranches[currentTranche];
        const trancheMonths = peaks_tranches[currentTranche][0];

        const givenMonth = `${selectedYear}${trancheMonths}`;
        const monthsList = listMonths(givenMonth, 11);

        const generatedPeriods = monthsList.join(";");
        const inputDataElement = 'Rl85S6SUvUz'
        // const url = `${baseUrl}/api/analytics/dataValueSet.json?dimension=dx:${precipitation_DataElement}&dimension=ou:${selectedLevels.map(selectedLevel => `LEVEL-${selectedLevel}`).join(';')}&dimension=pe:${generatedPeriods}&showHierarchy=false&hierarchyMeta=false&includeMetadataDetails=true&includeNumDen=true&skipRounding=false&completedOnly=false`
        // const url = `${baseUrl}/api/analytics/dataValueSet.json?dimension=dx:${precipitation_DataElement}&dimension=ou:${`LEVEL-${selectedLevels}`}&dimension=pe:${generatedPeriods}&showHierarchy=false&hierarchyMeta=false&includeMetadataDetails=true&includeNumDen=true&skipRounding=false&completedOnly=false`;
        // const url = `${baseUrl}/api/analytics/dataValueSet.json?dimension=dx:${inputDataElement}&dimension=ou:${`LEVEL-${selectedLevels}`}&dimension=pe:${getMoisDeAnnee(selectedYear)?.join(';')||''}&showHierarchy=false&hierarchyMeta=false&includeMetadataDetails=true&includeNumDen=true&skipRounding=false&completedOnly=false`;
        const url = `${baseUrl}/api/analytics/dataValueSet.json?dimension=dx:${precipitation_DataElement}&dimension=ou:${`LEVEL-${selectedLevels}`}&dimension=pe:${getMoisDeAnnee(selectedYear)?.join(';')||''}&showHierarchy=false&hierarchyMeta=false&includeMetadataDetails=true&includeNumDen=true&skipRounding=false&completedOnly=false`;
        const casesDataResponse = await axios.get(url);

        const ou_ids = [
          ...new Set([
            ...casesDataResponse.data.dataValues.map(
              (dataValue) => dataValue.orgUnit
            ),
          ]),
        ];

        for (const id of ou_ids) {
          let peaks_ou_value = tmpPeaksData.find((d) => d.ouId === id);
          if (!peaks_ou_value) {
            peaks_ou_value = {
              ouId: id,
              ouName: organisationUnits.find((ou) => ou.id === id)?.displayName,
              v1: 0,
              v2: 0,
              v3: 0,
              v4: 0,
              v5: 0,
              v6: 0,
              v7: 0,
              v8: 0,
              v9: 0,
            };
          }

          const total = casesDataResponse.data.dataValues
            .filter((dataValue) => dataValue.orgUnit === id)
            .reduce((prev, curr) => {
              return parseFloat(prev) + parseFloat(curr.value);
            }, 0);

          const total_tranche = casesDataResponse.data.dataValues
            .filter(
              (dataValue) =>
                dataValue.orgUnit === id &&
                trancheActuelle
                  .map((t) => `${selectedYear}${t}`)
                  .includes(dataValue.period)
            )
            .reduce((prev, curr) => {
              return parseFloat(prev) + parseFloat(curr.value);
            }, 0);
          const pourcentage_tranche = calculerPourcentage(total_tranche, total);

          if (id === 'eqkx5pULvwl' && pourcentage_tranche >= 60) {
            console.log('le ou est ', id)
            console.log('le ou est ', organisationUnits.find((ou) => ou.id === id))
            console.log('le total est ', total)
            console.log('le total_tranche est ', total_tranche)
            console.log('le pourcentage_tranche est ', pourcentage_tranche)

            const totalValues = casesDataResponse.data.dataValues
              .filter((dataValue) => dataValue.orgUnit === id)
            console.log('totoal values is then this ', totalValues)
          }

          peaks_ou_value[
            `${currentTranche.toLowerCase().replace("tranche", "v")}`
          ] = pourcentage_tranche >= 60 ? 1 : 0;
          tmpPeaksData.push(peaks_ou_value);
        }
      }

      const updatedPeaksData = [...tmpPeaksData]
        .sort((a, b) => {
          const nameA = a.ouName.toUpperCase(); // ignore upper and lowercase
          const nameB = b.ouName.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        })
        .map((tmpPeakData) => {
          const valueKeys = Object.keys(tmpPeakData).filter((d) =>
            d.startsWith("v")
          );
          const arrayData = [];

          for (const v of valueKeys) {
            arrayData.push(tmpPeakData[v]);
          }


          return {
            ...tmpPeakData,
            consecutivePeaks: consecutivePeaks(arrayData),
          };
        });

      const tmpData = uniqueById(updatedPeaksData);

      setPeaksData(tmpData);

      const dataValues = tmpData
        .map((d) => ({
          value: d?.consecutivePeaks?.longestPeak,
          orgUnit: d?.ouId,
          period: selectedYear,
          dataElement: target_DataElement,
        }))
        .filter((d) => d.value > 0);

      await injectDataToTarget(baseUrl, dataValues);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setPeaksData([]);

      console.log(error.message);
    }
  };

  const handleOpenSettings = () => {
    setOpenModal(true);
  };

  const handleModalOK = () => {
    axios
      .put(`${baseUrl}/api/dataStore/climate_health/settings`, {
        indicator: precipitation_DataElement,
        dataElement: target_DataElement,
      })
      .then((response) => {
        console.log("response : ", response.data);
        setOpenModal(false);
      })
      .catch((error) => {
        console.log(error.message);
        setOpenModal(false);
      });
  };

  const RenderSettingsModal = () => (
    <Modal
      title="Basic Modal"
      open={openModal}
      onOk={handleModalOK}
      onCancel={() => setOpenModal(false)}
    >
      <div className="flex justify-between ">
        <div>Select indicator</div>
        <div>
          <Select
            showSearch
            style={{ minWidth: "300px" }}
            options={indicators.map((ind) => ({
              value: ind.id,
              label: ind.displayName,
            }))}
            value={precipitation_DataElement}
            onChange={(value) => setPrecipitation_DataElement(value)}
          />
        </div>
      </div>
      <div className="flex justify-between ">
        <div>Select data element</div>
        <div>
          <Select
            showSearch
            style={{ minWidth: "300px" }}
            options={dataElements.map((ind) => ({
              value: ind.id,
              label: ind.displayName,
            }))}
            value={target_DataElement}
            onChange={(value) => setTarget_DataElement(value)}
          />
        </div>
      </div>
    </Modal>
  );

  useEffect(() => {
    setPeaksData([]);
  }, [selectedLevels, selectedYear]);

  return (
    <Spin spinning={loading} delay={500}>
      <div>
        <div className="flex bg-[2c6693] text-[ffffff] text-4xl p-2 justify-between">
          <div>
            {levels.length > 0 && (
              <Select
                showSearch
                // size='small'
                placeholder="Select Level"
                onChange={onLevelsSelected}
                style={{
                  minWidth: "200px",
                  maxWidth: "400px",
                  marginLeft: "10px",
                }}
                options={levels.map((level) => ({
                  label: level?.displayName,
                  value: level?.id,
                }))}
              />
            )}

            <DatePicker
              // size='small'
              onChange={onYearSelectionChange}
              picker="year"
              style={{
                minWidth: "200px",
                maxWidth: "400px",
                marginLeft: "10px",
                marginRight: "10px",
              }}
            />

            <Button
              primary
              loading={loading}
              onClick={loadPeaksData}
              disabled={selectedLevels.length === 0 || !selectedYear}
            >
              Load Data
            </Button>
          </div>

          <div>
            <IoSettings
              onClick={handleOpenSettings}
              className="cursor-pointer "
            />
            {RenderSettingsModal()}
          </div>
        </div>

        {peaksData.length > 0 && (
          <div className="m-2 border p-2">
            <div className="block m-2">Peaks</div>

            <Row gutter={8}>
              {peaksData.map((ouD) => (
                <Col span={6} key={uuidv4()}>
                  <ChartBuilder
                    label={ouD?.ouName}
                    labels={[
                      "Jan-Apr",
                      "Feb-May",
                      "Mar-Jun",
                      "Apr-Jul",
                      "May-Aug",
                      "Jun-Sep",
                      "Jul-Oct",
                      "Aug-Nov",
                      "Sep-Dec",
                    ]}
                    data={[
                      ouD.v1,
                      ouD.v2,
                      ouD.v3,
                      ouD.v4,
                      ouD.v5,
                      ouD.v6,
                      ouD.v7,
                      ouD.v8,
                      ouD.v9,
                    ]}
                  />

                  <div className="m-1 px-4 font-bold bg-slate-200">
                    Consecutive Peaks: {ouD?.consecutivePeaks?.longestPeak ?? 0}
                    {Object.keys(ouD?.consecutivePeaks?.peakLengths).length >
                      0 && (
                        <ObjectToTable
                          data={ouD?.consecutivePeaks?.peakLengths}
                        />
                      )}
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>
    </Spin>
  );
};

export default App;
