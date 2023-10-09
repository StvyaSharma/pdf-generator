import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ReactMarkdown from 'react-markdown';

import PdfContent from './components/PdfContent';

const PdfPage = () => {
  const contentRef = useRef();
  const [contentItems, setContentItems] = useState([]);
  const [newContent, setNewContent] = useState('');
  const [contentSize, setContentSize] = useState(16);
  const [contentType, setContentType] = useState('text');
  const [uploadedImage, setUploadedImage] = useState(null);

  // Table state
  const [tableRows, setTableRows] = useState(2);
  const [tableColumns, setTableColumns] = useState(2);
  const [tableData, setTableData] = useState([]);

  const handleGeneratePDF = async () => {
    const content = contentRef.current;

    try {
      const canvas = await html2canvas(content);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);

      // Add horizontal rules and tables to the PDF
      contentItems.forEach((item) => {
        if (item.type === 'hr') {
          pdf.setLineWidth(0.1); // Set line width for horizontal rule
          pdf.line(10, pdf.autoTable.previous.finalY + 10, 200, pdf.autoTable.previous.finalY + 10);
        } else if (item.type === 'table') {
          // Add table
          pdf.autoTable({
            startY: pdf.autoTable.previous.finalY + 10,
            head: [item.data[0]],
            body: item.data.slice(1),
          });
        }
      });

      pdf.save('document.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const generateTablePreview = () => {
    const table = [];
    for (let i = 0; i < tableRows; i++) {
      const row = [];
      for (let j = 0; j < tableColumns; j++) {
        row.push('');
      }
      table.push(row);
    }
    setTableData(table);
  };

  const addContent = () => {
    if (newContent.trim() === '' && contentType === 'hr') {
      const newItem = { type: 'hr', size: contentSize };
      setContentItems([...contentItems, newItem]);
    } else if (contentType === 'table') {
      const newItem = { type: 'table', data: tableData, size: contentSize };
      setContentItems([...contentItems, newItem]);
      setTableData([]);
    } else if (newContent.trim() !== '') {
      const newItem = { type: contentType, content: newContent, size: contentSize };
      setContentItems([...contentItems, newItem]);
      setNewContent('');
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newItem = { type: 'image', content: e.target.result, size: contentSize };
        setContentItems([...contentItems, newItem]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <button onClick={handleGeneratePDF}>Generate PDF</button>
      <div>
        {contentType !== 'upload-image' && contentType !== 'hr' && (
          <label>
            Add Content:
            <input
              type="text"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
          </label>
        )}
        <select
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
        >
          <option value="heading">Heading</option>
          <option value="text">Text</option>
          <option value="image-link">Image Link</option>
          <option value="upload-image">Upload Image</option>
          <option value="hr">Horizontal Rule</option>
          <option value="table">Table</option>
        </select>
        <label>
          Size (px):
          <input
            type="number"
            value={contentSize}
            onChange={(e) => setContentSize(e.target.value)}
          />
        </label>
        {contentType === 'upload-image' && (
          <label>
            Upload Image:
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
        )}
        {contentType === 'table' && (
          <div>
            <label>
              Rows:
              <input
                type="number"
                value={tableRows}
                onChange={(e) => setTableRows(e.target.value)}
              />
            </label>
            <label>
              Columns:
              <input
                type="number"
                value={tableColumns}
                onChange={(e) => setTableColumns(e.target.value)}
              />
            </label>
            <button onClick={generateTablePreview}>Generate Table</button>
            <table>
              <tbody>
                {tableData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, columnIndex) => (
                      <td key={columnIndex}>
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => {
                            const updatedTable = [...tableData];
                            updatedTable[rowIndex][columnIndex] = e.target.value;
                            setTableData(updatedTable);
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {contentType !== 'upload-image' && (
          <button onClick={addContent}>Add</button>
        )}
      </div>
      <div ref={contentRef} style={{width : '80%',minHeight: 'calc(1.41*calc(0.8*100vw))', background: 'white', margin: 'auto', marginBlock: '40px',padding:'38px'}}>
        <PdfContent contentItems={contentItems} />
      </div>
    </div>
  );
};

export default PdfPage;
