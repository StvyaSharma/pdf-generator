import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

const PdfContent = ({ contentItems }) => {
  return (
    <div>
      {contentItems.map((item, index) => {
        if (item.type === 'heading') {
          return (
            <h1 key={index} style={{ fontSize: `${item.size}px` }}>
              <ReactMarkdown>{item.content}</ReactMarkdown>
            </h1>
          );
        } else if (item.type === 'text') {
          return (
            <p key={index} style={{ fontSize: `${item.size}px` }}>
              <ReactMarkdown>{item.content}</ReactMarkdown>
            </p>
          );
        } else if (item.type === 'image') {
          return (
            <img
              key={index}
              src={item.content}
              alt={`Image ${index}`}
              style={{
                display: 'inline-block',
                marginRight: '10px',
                width: `${item.size}px`,
              }}
            />
          );
        } else if (item.type === 'hr') {
          return (
            <hr key={index} style={{ width: '100%', height: `${item.size}px` }} />
          );
        } else if (item.type === 'table') {
          return (
            <table key={index} style={{ borderCollapse: 'collapse', marginBottom: '10px' }}>
              <tbody>
                {item.data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, columnIndex) => (
                      <td
                        key={columnIndex}
                        style={{
                          border: '1px solid #000',
                          padding: '5px',
                          fontSize: `${item.size}px`,
                        }}
                      >
                        <ReactMarkdown>{cell}</ReactMarkdown>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          );
        }
        return null;
      })}
    </div>
  );
};

PdfContent.propTypes = {
  contentItems: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      content: PropTypes.string,
      size: PropTypes.number,
      data: PropTypes.array, // Add data for tables
    })
  ).isRequired,
};

export default PdfContent;
