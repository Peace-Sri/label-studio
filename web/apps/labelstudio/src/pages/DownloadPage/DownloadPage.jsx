import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router";
import { Modal } from "../../components/Modal/Modal";
import { useFixedLocation } from "../../providers/RoutesProvider";
import { Pagination } from "@humansignal/ui";
// import { BemWithSpecificContext } from "../../utils/bem";
import { cn } from "../../utils/bem";

// const { Block, Elem } = BemWithSpecificContext();

// --- Icon Download ---
const DownloadIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z" fill="white" />
    </svg>
);

export const DownloadPage = () => {
    const history = useHistory();
    const location = useFixedLocation();
    const { id } = useParams();
    const [modelLists, setModelLists] = useState([]);


    useEffect(() => {
        const fetchModelLists = async () => {
            const response = await fetch(`/clavi/model/lists/${id}`)
            const modelLists = await response.json();
            setModelLists(modelLists.data.reverse())
        }
        fetchModelLists();
    }, [id])

    // --- State Pagination ---
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 4;

    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentItems = modelLists.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(modelLists.length / pageSize);

    const onClose = () => {
        const path = location.pathname.replace(DownloadPage.path, "");
        const search = location.search;
        history.replace(`${path}${search !== "?" ? search : ""}`);
    };

    return (
        <Modal
            onHide={onClose}
            title="Download Models"
            style={{ width: 720 }}
            closeOnClickOutside={false}
            allowClose={true}
            visible
            bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', minHeight: '500px' }}
        >
            <div className={cn("download-page").toClassName()} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* <Block name="download-page" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}> */}

                <div className={cn("download-page").elem("content").toClassName()} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
                {/* <Elem name="content" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}> */}

                    {currentItems.map((item) => (
                        <div
                            key={item.TrainID}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                border: "1px solid rgba(255, 255, 255, 0.15)",
                                borderRadius: "8px",
                                paddingBottom: "16px"
                            }}
                        >
                            {/* Left Text */}
                            <div style={{
                                display: "flex",
                                padding: "16px 15px 0 15px",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                gap: "10px",
                                alignSelf: "stretch",
                                flex: 1,
                            }}>
                                <div style={{ color: "#fff", fontSize: "16px", fontWeight: "600" }}>{item.train_name}</div>
                                <div style={{ color: "#888", fontSize: "12px" }}>
                                    {item.pretrain_name} | {new Date(item.CreatedAt).toLocaleDateString('ja-JP', {
                                        timeZone: 'Asia/Tokyo',
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit'
                                    })}
                                </div>
                                <div style={{ color: "#aaa", fontSize: "14px", lineHeight: "1.4" }}>{item.note}</div>
                            </div>

                            {/* Right Button */}
                            <div style={{ padding: "0 20px" }}>
                                <button
                                    onClick={async () => {window.location.href = `/clavi/model/download/${item.TrainID}`}}
                                    style={{
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        width: "48px", height: "48px",
                                        backgroundColor: "#5C7CFF", border: "none", borderRadius: "8px",
                                        cursor: "pointer",
                                    }}
                                >
                                    <DownloadIcon />
                                </button>
                            </div>
                        </div>
                    ))}

                {/* </Elem> */}
                </div>
                <div className={cn("download-page").elem("footer").toClassName()} style={{
                    padding: "16px 20px",
                    //   borderTop: "1px solid #444", 
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                {/* <Elem name="footer" style={{
                    padding: "16px 20px",
                    //   borderTop: "1px solid #444", 
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}> */}

                    <div style={{ color: '#fff' }}> 
                        <Pagination
                            currentPage={currentPage}
                            totalItems={modelLists.length}
                            pageSize={pageSize}
                            totalPages={totalPages}
                            onPageChange={(page) => setCurrentPage(page)}
                            pageSizeOptions={[4]}
                            showPageSize={false}
                            label="Models"
                        />
                    </div>
                {/* </Elem> */}
                </div>

            {/* </Block> */}
            </div>
        </Modal>
    );
};

DownloadPage.path = "/download";
DownloadPage.modal = true;