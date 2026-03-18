import { useHistory, useParams } from "react-router";
import { Button, Select, Card, Pagination } from "@humansignal/ui";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@humansignal/ui/shad/components/ui/tabs";
import { Input, TextArea } from "../../components/Form";
import { Modal } from "../../components/Modal/Modal";
import { useFixedLocation } from "../../providers/RoutesProvider";
import { BemWithSpecificContext } from "../../utils/bem";
import React from 'react';

import { useState, useEffect } from "react";

const { Block, Elem } = BemWithSpecificContext();

const TrainingStatus = () => {
  const [trainingDetails, setTrainingDetail] = useState({})
  useEffect(() => {
    const fetchTrainingDetails = async () => {
      const response = await fetch("http://localhost:8000/node/status");
      const trainingDetails = await response.json();
      setTrainingDetail(trainingDetails)
    };
    fetchTrainingDetails();

    const interval = setInterval(fetchTrainingDetails, 5000);

    return () => clearInterval(interval);
  }, [])
  return (
    <div style={{
      // Main Layout
      display: 'flex',
      padding: '8px 32px 24px 32px',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-end',
      gap: '36px',
      alignSelf: 'stretch',
      minHeight: '400px'
    }}>

      {/* --- Header Section --- */}
      <div style={{ width: '100%' }}>
        <div style={{
          // Title Wrapper
          display: 'flex',
          padding: '16px 0',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          alignSelf: 'stretch',
          flexDirection: 'column'
        }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>
            Model Name
          </h1>
          <div style={{ color: '#888', fontSize: '14px' }}>
            Model Info | Date
          </div>
        </div>

        <div style={{ width: '100%', marginTop: '20px' }}>
          <div style={{
            display: 'flex',
            padding: '0 32px',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'stretch',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: 500
          }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span>Status</span>
            </div>
            <div>
              <span>{(trainingDetails.eta_epoch * trainingDetails.current_epoch).toFixed(2)} Minutes/{(trainingDetails.eta_epoch * trainingDetails.total_epochs).toFixed(2)} Minutes</span>
            </div>
          </div>
          <div style={{ height: '8px', background: '#e5e5e5', borderRadius: '4px', margin: '0 32px', overflow: 'hidden' }}>
            <div style={{ width: `${(trainingDetails.current_epoch / trainingDetails.total_epochs).toFixed(2) * 100}%`, height: '100%', background: '#09f', borderRadius: '4px' }}></div>
          </div>
        </div>
      </div>

      {/* --- Detail Section --- */}
      <div style={{
        // Detail Wrapper
        display: 'flex',
        padding: '12px 0 32px 0',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '32px',
        alignSelf: 'stretch',
        width: '100%'
      }}>
        {/* Divider */}
        <div style={{ width: '100%' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 12px 0' }}>Detail</h2>
          <div style={{ height: '1px', background: '#333', width: '100%', opacity: 0.8 }}></div>
        </div>

        {/* Columns Wrapper */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '36px',
          width: '100%'
        }}>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '16px',
            alignSelf: 'stretch',
            flex: 1
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: "4px 18px" }}>
              <span style={{ fontSize: "18px", fontWeight: 600 }}>Metrics</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: "4px 18px" }}>
              <span style={{ fontWeight: 600 }}>precision(B)</span> <span>{trainingDetails.metrics?.["metrics/precision(B)"] ?? "-"}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: "4px 18px" }}>
              <span style={{ fontWeight: 600 }}>recall(B)</span> <span>{trainingDetails.metrics?.["metrics/recall(B)"] ?? "-"}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: "4px 18px" }}>
              <span style={{ fontWeight: 600 }}>mAP50(B)</span> <span>{trainingDetails.metrics?.["metrics/mAP50(B)"] ?? "-"}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: "4px 18px" }}>
              <span style={{ fontWeight: 600 }}>mAP50-95(B)</span> <span>{trainingDetails.metrics?.["metrics/mAP50-95(B)"] ?? "-"}</span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '16px',
            alignSelf: 'stretch',
            flex: 1
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: "4px 18px" }}>
              <span style={{ fontSize: "18px", fontWeight: 600 }}>Val</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: "4px 18px" }}>
              <span style={{ fontWeight: 600 }}>box_loss</span> <span>{trainingDetails.metrics?.["val/box_loss"] ?? "-"}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: "4px 18px" }}>
              <span style={{ fontWeight: 600 }}>seg_loss</span> <span>{trainingDetails.metrics?.["val/seg_loss"] ?? "-"}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: "4px 18px" }}>
              <span style={{ fontWeight: 600 }}>cls_loss</span> <span>{trainingDetails.metrics?.["val/cls_loss"] ?? "-"}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: "4px 18px" }}>
              <span style={{ fontWeight: 600 }}>dfl_loss</span> <span>{trainingDetails.metrics?.["val/dfl_loss"] ?? "-"}</span>
            </div>
          </div>

        </div>
      </div>

      {/* --- Footer Button --- */}
      <Button variant="negative">Stop</Button>

    </div>
  );
};

const TrainTabsContent = ({ onStartTrain, projectId }) => {
  const deviceOptions = [
    { value: 'auto', label: 'Auto' },
    { value: 'gpu', label: 'GPU' },
    { value: 'cpu', label: 'CPU' },

  ];
  const modelsAvailableOptions = [
    { value: 'yolov8', label: 'YOLOV8' },
    { value: 'yolo11', label: 'YOLO11' },
    { value: 'yolo12', label: 'YOLO12' },
  ];
  const formatAvailableOptions = [
    { value: 'onnx', label: 'onnx' }
  ];
  const epochOptions = [
    { value: 'auto', label: 'Auto' },
    { value: '10', label: '10' },
    { value: '50', label: '50' },
    { value: '100', label: '100' },
  ];
  const modelSizeOptions = [
    { value: 'auto', label: 'Auto' },
    { value: 's', label: 'Small' },
    { value: 'm', label: 'Medium' },
    { value: 'l', label: 'Large' },
    { value: 'xl', label: 'Extra Large' },
  ];
  const [modelName, setModelName] = useState('')
  const [description, setDescription] = useState('')
  const [device, setDevice] = useState(deviceOptions[0].value)
  const [selectedModel, setSelectedModel] = useState(modelsAvailableOptions[0].value)
  const [modelFormat, selectModelFormat] = useState(formatAvailableOptions[0].value)
  const [epoch, setEpoch] = useState(epochOptions[0].value)
  const [duplicatedName, setDuplicatedname] = useState(false)
  const [modelSize, setModelSize] = useState(modelSizeOptions[0].value)
  const trainHandler = async () => {
    await fetch("http://localhost:8000/train", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_id: parseInt(projectId),
        train_name: modelName,
        note: description,
        task: "segment",
        pretrain_name: selectedModel,
        pretrain_size: modelSize,
        device: device,
        export_type: modelFormat,
        epoch: parseInt(epoch) || 10,
      }),
    });
    onStartTrain();
  };
  const [modelLists, setModelLists] = useState([]);
  useEffect(() => {
    const fetchModelLists = async () => {
      const response = await fetch(`http://localhost:8000/model/lists/${projectId}`)
      const modelLists = await response.json();
      setModelLists(modelLists.data)
    }
    fetchModelLists();
  }, [projectId])
  useEffect(() => {
    if (duplicatedName) {
      console.log("!!!! Cannot use this name. try again")
    }
  }, [duplicatedName])
  // modelsAvailableOptions[0]
  return (
    <Tabs defaultValue="basic" variant="flat" style={{ width: '100%' }}>

      <div>
        <TabsList>
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="advanced">advanced</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="basic" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ paddingBottom: '48' }}>
            <h2 style={{ margin: 0, paddingBottom: '12px', fontSize: '16px', fontWeight: 600 }}>Model Name</h2>
            <Input placeholder='Type name' style={{ width: '100%' }} value={modelName} onChange={(event) => {
              setModelName(event.target.value)
            }} onBlur={() => {
              let found = false;
              for (const item of modelLists) {
                if (modelName === item.train_name) {
                  found = true;
                  break;
                }
              }
              setDuplicatedname(found);
            }}></Input>
            {duplicatedName && <span style={{ color: 'red', fontSize: '14px' }}>This name already exists</span>}
          </div>
          <div style={{ paddingBottom: '48' }}>
            <h2 style={{ margin: 0, paddingBottom: '12px', fontSize: '16px', fontWeight: 600 }}>Note</h2>
            <TextArea placeholder='Description' style={{ width: '100%', minHeight: '100px' }} value={description} onChange={(event) => {
              setDescription(event.target.value)
            }}></TextArea>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
            <Button look="outlined">Cancel</Button>
            <Button onClick={trainHandler}> Train </Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="advanced" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ margin: 0, paddingBottom: '12px', fontSize: '16px', fontWeight: 600 }}>Select Device</h2>
            {/* <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>Select Device</p> */}
            <div style={{ width: '40%' }}>
              <Select options={deviceOptions} placeholder='Select Device' value={device} onChange={(value) => {
                console.log(value)
                setDevice(value)
              }}></Select>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <div className="selectModel" style={{ width: '40%' }}>
                <h2 style={{ margin: 0, paddingBottom: '12px', fontSize: '16px', fontWeight: 600 }}>Select Model</h2>
                <div>
                  <Select options={modelsAvailableOptions} value={selectedModel} placeholder='Select Model' onChange={(value) => {
                    console.log(value)
                    setSelectedModel(value)
                  }}></Select>
                </div>
              </div>
              <div className="selectFormat" style={{ width: '40%' }}>
                <h2 style={{ margin: 0, paddingBottom: '12px', fontSize: '16px', fontWeight: 600 }}>Select Format</h2>
                <div style={{}}>
                  <Select options={formatAvailableOptions} placeholder='Select Format' value={modelFormat} onChange={(value) => {
                    console.log(value)
                    selectModelFormat(value)
                  }}></Select>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <div className="selectEpoch" style={{ width: '40%' }}>
                <h2 style={{ margin: 0, paddingBottom: '12px', fontSize: '16px', fontWeight: 600 }}>Select Epoch</h2>
                <div style={{}}>
                  <Select options={epochOptions} placeholder='Select Epoch' value={epoch} onChange={(value) => {
                    setEpoch(value)
                  }}></Select>
                </div>
              </div>
              <div className="selectSize" style={{ width: '40%' }}>
                <h2 style={{ margin: 0, paddingBottom: '12px', fontSize: '16px', fontWeight: 600 }}>Select Model Size</h2>
                <div style={{}}>
                  <Select options={modelSizeOptions} placeholder='Select Model Size' value={modelSize} onChange={(value) => {
                    setModelSize(value)
                  }}></Select>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
            <Button look="outlined">Cancel</Button>
            <Button onClick={trainHandler}> Train </Button>
          </div>
        </div>
      </TabsContent>

    </Tabs>
  );
};

export const TrainPage = () => {
  const history = useHistory();
  const location = useFixedLocation();
  const { id } = useParams()
  const [isTraining, setIsTraining] = useState(false);

  useEffect(() => {
    const fetchTrainingDetails = async () => {
      const response = await fetch("http://localhost:8000/node/status");
      const trainingDetails = await response.json();
      if(trainingDetails.status != "FINISHED" && trainingDetails.status != "CANCELLED" && trainingDetails.status != "IDLE" ){
        setIsTraining(true)
      }
    };
    fetchTrainingDetails();
  }, [])

  return (
    <Modal
      onHide={() => {
        const path = location.pathname.replace(TrainPage.path, "");
        const search = location.search;
        history.replace(`${path}${search !== "?" ? search : ""}`);
      }}
      title="Train Model"
      style={{ width: 720 }}
      closeOnClickOutside={false}
      allowClose={true}
      visible
    >
      <Block name="train-page">

        <Elem name="content" style={{ padding: "20px", minHeight: "300px" }}>
          {isTraining ? <TrainingStatus /> : <TrainTabsContent onStartTrain={() => setIsTraining(true)} projectId={id} />}
        </Elem>
      </Block>
    </Modal>
  );
};

TrainPage.path = "/train";
TrainPage.modal = true;