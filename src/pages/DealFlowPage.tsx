import { useEffect, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { FeatureCollection, Geometry } from "geojson";
import FIPSModal from "../components/FIPSModal";

interface EducationDatum {
  fips: number;
  state: string;
  area_name: string;
  bachelorsOrHigher: number;
}

interface CountyData {
  type: "Topology";
  objects: {
    counties: any;
    states: any;
  };
  arcs: any[];
  transform: any;
}

export default function DealFlowPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFips, setSelectedFips] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("");

  useEffect(() => {
    const EDUCATION_URL =
      "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json";
    const COUNTY_URL =
      "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json";

    const fullwidth = 1000;
    const fullheight = 700;

    const load = async () => {
      const [countyRaw, educationRaw] = await Promise.all([
        d3.json(COUNTY_URL),
        d3.json(EDUCATION_URL),
      ]);

      const countyData = countyRaw as CountyData;
      const educationData = educationRaw as EducationDatum[];

      const counties = topojson.feature(
        countyData,
        countyData.objects.counties
      ) as unknown as FeatureCollection<Geometry>;

      const states = topojson.mesh(
        countyData,
        countyData.objects.states,
        (a: any, b: any) => a !== b
      );

      const path = d3.geoPath();

      const minEd = d3.min(educationData, (d) => d.bachelorsOrHigher)!;
      const maxEd = d3.max(educationData, (d) => d.bachelorsOrHigher)!;

      d3.select("#graph").selectAll("*").remove();

      const svg = d3
        .select("#graph")
        .append("svg")
        .attr("width", fullwidth)
        .attr("height", fullheight);

      const tooltip = d3
        .select("#tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", "beige")
        .style("color", "black")
        .style("padding", "6px")
        .style("border-radius", "4px");

      svg
        .selectAll("path")
        .data(counties.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "county")
        .attr("data-fips", (d: any) => d.id?.toString() ?? "")
        .attr("data-education", (d: any) => {
          const target = educationData.find((e) => e.fips === d.id);
          return target?.bachelorsOrHigher ?? 0;
        })
        .style("stroke", "grey")
        .style("stroke-width", "0.5px")
        .style("fill", (d: any) => {
          const target = educationData.find((e) => e.fips === d.id);
          return target
            ? d3.interpolateRdYlBu(1 - target.bachelorsOrHigher / maxEd)
            : "beige";
        })
        .on("mouseover", (event: MouseEvent, d: any) => {
          const target = educationData.find((e) => e.fips === d.id);
          if (!target) return;

          d3.select(event.currentTarget as SVGPathElement)
            .style("stroke", "black")
            .style("stroke-width", 0.9);

          tooltip
            .html(
              `${target.area_name}, ${target.state}<br/>Price Ꞙ ${target.bachelorsOrHigher.toFixed(2)}`
            )
            .attr("data-education", target.bachelorsOrHigher)
            .style("left", event.pageX + 15 + "px")
            .style("top", event.pageY - 50 + "px")
            .style("background", d3.interpolateRdYlBu(1 - target.bachelorsOrHigher / Math.round(maxEd)))
            .style("opacity", 0.9);
        })
        .on("mouseout", (event: MouseEvent) => {
          d3.select(event.currentTarget as SVGPathElement)
            .style("stroke", "grey")
            .style("stroke-width", 0.5);
          tooltip.style("opacity", 0);
        })
        .on("click", (event: MouseEvent, d: any) => {
          const target = educationData.find((e) => e.fips === d.id);
          if (target) {
            setSelectedFips(d.id.toString());
            setSelectedCounty(`${target.area_name}, ${target.state}`);
            setModalOpen(true);
          }
        });

      svg
        .append("path")
        .datum(states)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-linejoin", "round")
        .attr("class", "states")
        .attr("d", path);
    };

    void load();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <div id="tooltip" className="absolute z-50 pointer-events-none" />
      <div id="graph" className="flex justify-center items-center rounded-lg shadow-lg" />
      <FIPSModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fipsCode={selectedFips}
        countyName={selectedCounty}
      />
    </div>
  );
}
