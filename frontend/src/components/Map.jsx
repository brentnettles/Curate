import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import centerIcon from '../buttons/center.png';
import '../Style/Map.css';
import ArtworkDisplay from './ArtworkDisplay';

function Floorplan() {
    const svgRef = useRef();
    const [selectedGallery, setSelectedGallery] = useState(null);
    const zoom = useRef(d3.zoom().scaleExtent([1, 8]));  // Ref for zoom to access in the recenter function

    useEffect(() => {
        fetch("/MetMap.svg")
            .then(res => res.text())
            .then(svg => {
                svgRef.current.innerHTML = svg;
                const svgElement = svgRef.current.querySelector('svg');
                enhanceSVG(svgElement);
            });
    }, []);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (selectedGallery && !svgRef.current.contains(event.target)) {
                setSelectedGallery(null);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [selectedGallery]);

    const enhanceSVG = (svgElement) => {
        const svg = d3.select(svgElement);

        // Set up zoom
        zoom.current.on('zoom', (event) => {
            svg.select('#Layer_1').attr('transform', event.transform);
            svg.select('#Floor_1_Galleries').attr('transform', event.transform);
        });

        svg.call(zoom.current);
        svg.call(zoom.current.transform, d3.zoomIdentity);

        // Set up gallery interactions
        const galleriesLayer = svg.select('#Floor_1_Galleries');
        galleriesLayer.selectAll('rect')
            .each(function () {
                const rect = d3.select(this);
                const id = rect.attr('id') ? rect.attr('id').replace(/[_]/g, '') : '___';
                const originalColor = rect.style('fill');  // Store the original fill color
                const group = rect.node().parentNode.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'g'));
                d3.select(group).attr('class', 'room-group')
                    .style('cursor', 'pointer')
                    .on('click', () => {
                        setSelectedGallery(id);
                    })
                    .on('mouseover', function() {
                        d3.select(this).select('rect')
                            .transition()
                            .duration(150)
                            .style('fill', 'salmon');  // Change hover color
                    })
                    .on('mouseout', function() {
                        d3.select(this).select('rect')
                            .transition()
                            .duration(150)
                            .style('fill', originalColor);  // Revert fill color
                    });

                group.appendChild(rect.node());  // Append rectangle to group

                // Append text to group
                d3.select(group).append('text')
                    .attr('x', parseFloat(rect.attr('x')) + parseFloat(rect.attr('width')) / 2)
                    .attr('y', parseFloat(rect.attr('y')) + parseFloat(rect.attr('height')) / 2)
                    .attr('dominant-baseline', 'middle')
                    .attr('text-anchor', 'middle')
                    .text(id)
                    .style('fill', 'black')
                    .style('font-size', `${Math.min(parseFloat(rect.attr('width')), parseFloat(rect.attr('height'))) / 3}px`);
            });
    };

    const recenterSVG = () => {
        const svgElement = svgRef.current.querySelector('svg');
        d3.select(svgElement).transition().duration(750).call(zoom.current.transform, d3.zoomIdentity);
    };

    return (
        <div className="main-container"> 
            <div className="floorplan-container" style={{ position: 'relative' }}>
                <div ref={svgRef} className="floorplan-svg-container" />
                <button
  id="recenter-button"
  onClick={recenterSVG}
  style={{
    position: 'absolute',
    right: '10px',
    top: '10px',
    background: `url(${centerIcon}) no-repeat center center`,
    backgroundSize: 'cover',
    width: '50px',
    height: '50px',
    border: 'none',
    cursor: 'pointer'
  }}
></button>
                <div className="artwork-display-container">
                    {selectedGallery && <ArtworkDisplay galleryNumber={selectedGallery} />}
                </div>
            </div>
        </div>
    );
}

export default Floorplan;
