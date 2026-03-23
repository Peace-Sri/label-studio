import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router";
import { Modal } from "../../components/Modal/Modal";
import { useFixedLocation } from "../../providers/RoutesProvider";
import { Pagination } from "@humansignal/ui";
import { cn } from "../../utils/bem";

const DownloadIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z" fill="white" />
    </svg>
);

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});

const TrashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 6H5H21" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6M19 6L18.1245 19.1305C18.0544 20.1745 17.1816 21 16.135 21H7.86504C6.81836 21 5.94561 20.1745 5.87549 19.1305L5 6H19Z" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const DownloadPage = () => {
    const history = useHistory();
    const location = useFixedLocation();
    const { id } = useParams();
    const [modelLists, setModelLists] = useState([]);
    const [trainingStatus, setTrainingStatus] = useState({});
    const [expandedScores, setExpandedScores] = useState(new Set());

    const toggleScore = (trainId) => {
        setExpandedScores(prev => {
            const next = new Set(prev);
            next.has(trainId) ? next.delete(trainId) : next.add(trainId);
            return next;
        });
    };

    const handleDelete = async (trainId) => {
        if (!window.confirm('Delete this model?')) return;
        await fetch(`/clavi/model/${trainId}`, { method: 'DELETE' });
        setModelLists(prev => prev.filter(m => m.train_id !== trainId));
    };

    useEffect(() => {
        const fetchModelLists = async () => {
            const response = await fetch(`/clavi/model/lists/${id}`);
            const data = await response.json();
            setModelLists((data.data || []).reverse());
        };
        fetchModelLists();
    }, [id]);

    useEffect(() => {
        const fetchStatus = async () => {
            const response = await fetch(`/clavi/node/status?project_id=${id}`);
            const data = await response.json();
            setTrainingStatus(data);
        };
        fetchStatus();
        const interval = setInterval(fetchStatus, 5000);
        return () => clearInterval(interval);
    }, [id]);

    const isActiveTraining = trainingStatus.status && !['FINISHED', 'CANCELLED', 'IDLE', 'ERROR'].includes(trainingStatus.status);
    const trainingModel = isActiveTraining ? modelLists[0] : null;
    const finishedModels = isActiveTraining ? modelLists.slice(1) : modelLists;

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 4;
    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentItems = finishedModels.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(finishedModels.length / pageSize);

    const progressPct = trainingStatus.total_epochs > 0
        ? Math.min(100, Math.round((trainingStatus.current_epoch / trainingStatus.total_epochs) * 100))
        : 0;

    const onClose = () => {
        const path = location.pathname.replace(DownloadPage.path, "");
        const search = location.search;
        history.replace(`${path}${search !== "?" ? search : ""}`);
    };

    return (
        <Modal
            onHide={onClose}
            title="Model"
            style={{ width: 720 }}
            closeOnClickOutside={false}
            allowClose={true}
            visible
            bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', minHeight: '500px' }}
        >
            <div style={{ padding: '4px 8px 0 8px', color: 'var(--sand-500, #888)', fontSize: '14px', marginTop: '-8px', marginLeft: '12px' }}>
                You can download model by click download button
            </div>

            <div className={cn("download-page").toClassName()} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div className={cn("download-page").elem("content").toClassName()} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>

                    {/* --- Training Card --- */}
                    {trainingModel && (
                        <div style={{
                            background: 'linear-gradient(135deg, #5C7CFF 0%, #7B8FE0 100%)',
                            borderRadius: '12px',
                            padding: '20px 24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ color: '#fff', fontSize: '22px', fontWeight: '700' }}>{trainingModel.train_name}</div>
                                    <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', marginTop: '4px' }}>
                                        {trainingModel.pretrain_name} | {formatDate(trainingModel.CreatedAt)}
                                    </div>
                                </div>
                                <button
                                    onClick={() => history.push(location.pathname.replace(DownloadPage.path, '') + '/train')}
                                    style={{
                                        background: 'transparent', border: '2px solid rgba(255,255,255,0.8)',
                                        borderRadius: '10px', color: '#fff', padding: '8px 18px',
                                        fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                                    }}
                                >
                                    See More
                                </button>
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#fff', fontSize: '14px', fontWeight: '600' }}>
                                    <span>{progressPct}% To Complete</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span>⏱</span>
                                        <span>
                                            {trainingStatus.eta_epoch && trainingStatus.current_epoch
                                                ? `${Math.round(trainingStatus.eta_epoch * trainingStatus.current_epoch / 60)} Min / ${Math.round(trainingStatus.eta_epoch * trainingStatus.total_epochs / 3600)} Hour`
                                                : '- / -'
                                            }
                                        </span>
                                    </span>
                                </div>
                                <div style={{ height: '8px', background: 'rgba(255,255,255,0.3)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: `${progressPct}%`, height: '100%', background: '#fff', borderRadius: '4px', transition: 'width 0.5s ease' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- Finished Model List --- */}
                    {currentItems.map((item) => {
                        const isExpanded = expandedScores.has(item.train_id);
                        const finalMetrics = item.final_metrics || {};
                        const metricEntries = Object.entries(finalMetrics.metric || {});
                        const valEntries = Object.entries(finalMetrics.val || {});
                        const hasScore = metricEntries.length > 0 || valEntries.length > 0;

                        return (
                            <div
                                key={item.train_id}
                                style={{
                                    border: "1px solid var(--sand-200, rgba(0,0,0,0.1))",
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                }}
                            >
                                {/* Header: name + chevron */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "16px 20px 8px" }}>
                                    <div>
                                        <div style={{ fontSize: "16px", fontWeight: "600" }}>{item.train_name}</div>
                                        <div style={{ fontSize: "12px", opacity: 0.6, marginTop: "4px" }}>
                                            {item.pretrain_name} | {formatDate(item.CreatedAt)}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleScore(item.train_id)}
                                        style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", fontSize: "14px", opacity: 0.6 }}
                                    >
                                        {isExpanded ? "▲" : "▼"}
                                    </button>
                                </div>

                                {/* Note */}
                                {item.note && (
                                    <div style={{ padding: "0 20px 12px", fontSize: "14px", opacity: 0.7, lineHeight: "1.5" }}>{item.note}</div>
                                )}

                                {/* Expanded score panel */}
                                {isExpanded && hasScore && (
                                    <div style={{ padding: "16px 20px 20px", display: "flex", gap: "32px" }}>
                                        {metricEntries.length > 0 && (
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: "700", fontSize: "15px", marginBottom: "10px" }}>Metrics</div>
                                                {metricEntries.map(([k, v]) => (
                                                    <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                                                        <span>{k.replace('metrics/', '')}:</span>
                                                        <span style={{ opacity: 0.6 }}>{typeof v === 'number' ? v.toFixed(4) : v}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {valEntries.length > 0 && (
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: "700", fontSize: "15px", marginBottom: "10px" }}>Val</div>
                                                {valEntries.map(([k, v]) => (
                                                    <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                                                        <span>{k}:</span>
                                                        <span style={{ opacity: 0.6 }}>{typeof v === 'number' ? v.toFixed(4) : v}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Action buttons */}
                                <div style={{ display: "flex", gap: "12px", padding: "8px 20px 16px" }}>
                                    <button
                                        onClick={() => handleDelete(item.train_id)}
                                        style={{
                                            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                                            padding: "12px", border: "2px solid #E53E3E", borderRadius: "8px",
                                            background: "none", color: "#E53E3E", fontSize: "15px", fontWeight: "600", cursor: "pointer",
                                        }}
                                    >
                                        <TrashIcon /> Delete
                                    </button>
                                    <button
                                        onClick={() => { window.location.href = `/clavi/model/download/${item.train_id}`; }}
                                        style={{
                                            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                                            padding: "12px", border: "none", borderRadius: "8px",
                                            backgroundColor: "#5C7CFF", color: "#fff", fontSize: "15px", fontWeight: "600", cursor: "pointer",
                                        }}
                                    >
                                        <DownloadIcon /> Download
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {finishedModels.length === 0 && !trainingModel && (
                        <div style={{ textAlign: 'center', opacity: 0.5, padding: '40px 0' }}>No models available</div>
                    )}

                </div>

                <div className={cn("download-page").elem("footer").toClassName()} style={{
                    padding: "16px 20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Pagination
                        currentPage={currentPage}
                        totalItems={finishedModels.length}
                        pageSize={pageSize}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                        pageSizeOptions={[4]}
                        showPageSize={false}
                        label="Models"
                    />
                </div>
            </div>
        </Modal>
    );
};

DownloadPage.path = "/download";
DownloadPage.modal = true;
