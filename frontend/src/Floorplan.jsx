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

        // Get the dimensions of the SVG
        const svgWidth = parseFloat(svg.attr('width'));
        const svgHeight = parseFloat(svg.attr('height'));
        setSvgDimensions({ width: svgWidth, height: svgHeight });

        // Set the viewBox to match the dimensions of the SVG
        svg.attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('class', 'floorplan-svg') // Add className to the SVG element
            .attr('width', '100%') // Set width to 100%
            .attr('height', '100%'); // Set height to 100%

        // Configure zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.2, 8]) // Set scale extent from 20% to 800%
            .on('zoom', (event) => {
                svg.select('#Layer_background').attr('transform', event.transform);
                svg.select('#Layer_rooms').attr('transform', event.transform); // Apply the same transform to layer_rooms
            });

        svg.call(zoom);

        // Initialize zoom at 20% scale
        const initialTransform = d3.zoomIdentity.scale(1.6);
        svg.call(zoom.transform, initialTransform);

        // Stretch layer_background to fill svg-container
        svg.select('#Layer_background')
            .attr('width', '100%')
            .attr('height', '100%');

        // Handle room group creation and interaction
        const roomsLayer = svg.select('#Layer_rooms');
        roomsLayer.selectAll('rect')
            .each(function () {
                const rect = d3.select(this);
                const x = parseFloat(rect.attr('x'));
                const y = parseFloat(rect.attr('y'));
                const width = parseFloat(rect.attr('width'));
                const height = parseFloat(rect.attr('height'));
                const galleryNumber = rect.attr('data-gallery-number');

                // Create a group for each room
                const group = rect.node().parentNode.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'g'));
                d3.select(group).attr('class', 'room-group')
                    .style('cursor', 'pointer')
                    .on('click', () => {
                        console.log(`Gallery ${galleryNumber} clicked!`);
                        setSelectedGallery(galleryNumber);
                    });

                // Move rectangle into the group
                group.appendChild(rect.node());

                // Add text label to the group
                d3.select(group).append('text')
                    .attr('x', x + width / 2) // Adjust the x position
                    .attr('y', y + height / 2) // Adjust the y position
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
