import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './Floorplan.css'; // Import CSS file
import ArtworkDisplay from './ArtworkDisplay';

function Floorplan() {
    const svgRef = useRef();
    const [selectedGallery, setSelectedGallery] = useState(null);
    const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        fetch("/floorplan1.svg")
            .then(res => res.text())
            .then(svg => {
                svgRef.current.innerHTML = svg;
                const svgElement = svgRef.current.querySelector('svg');
                enhanceSVG(svgElement);
            });
    }, []);

    const enhanceSVG = (svgElement) => {
        const svg = d3.select(svgElement);
        const background = svg.select('#Layer_background');
    
        // Calculate the bounding box of the background layer
        const bbox = background.node().getBBox();
        const viewBox = `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`;
    
        svg.attr('viewBox', viewBox)
       .attr('preserveAspectRatio', 'xMidYMid meet')
       .attr('class', 'floorplan-svg') // Add className to the SVG element
       .attr('width', '100%') // Set width to 100%
       .attr('height', '100%'); // Set height to 100%
    
        // Define the zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([1, 8])  // Here, 1 is the minimum scale. Adjust this value based on your needs.
            .on('zoom', (event) => {
                svg.selectAll('#Layer_background, #Layer_rooms').attr('transform', event.transform);
            });
    
        svg.call(zoom);
        const initialTransform = d3.zoomIdentity.scale(1);  // Start at the minimum scale
        svg.call(zoom.transform, initialTransform);
    
        const roomsLayer = svg.select('#Layer_rooms');
        roomsLayer.selectAll('rect')
            .each(function () {
                const rect = d3.select(this);
                const x = parseFloat(rect.attr('x'));
                const y = parseFloat(rect.attr('y'));
                const width = parseFloat(rect.attr('width'));
                const height = parseFloat(rect.attr('height'));
                const galleryNumber = rect.attr('data-gallery-number');
    
                const group = rect.node().parentNode.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'g'));
                d3.select(group).attr('class', 'room-group')
                    .style('cursor', 'pointer')
                    .on('click', () => {
                        console.log(`Gallery ${galleryNumber} clicked!`);
                        setSelectedGallery(galleryNumber);
                    });
    
                group.appendChild(rect.node());
                d3.select(group).append('text')
                    .attr('x', x + width / 2)
                    .attr('y', y + height / 2)
                    .attr('dominant-baseline', 'middle')
                    .attr('text-anchor', 'middle')
                    .text(galleryNumber)
                    .style('font-size', '12px')
                    .style('fill', 'black');
            });
    };
    

    return (
        <div className="floorplan-container">
            <div ref={svgRef} className="floorplan-svg-container" />
            <div className="artwork-display-container">
                {selectedGallery && <ArtworkDisplay galleryNumber={selectedGallery} />}
            </div>
        </div>
    );
}

export default Floorplan;
