// src/pages/DealFlowPage.tsx

import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { FeatureCollection, Geometry } from "geojson";
import FIPSModal from "../components/FIPSModal";

/* ---------- types ---------- */
interface EducationDatum {
  fips: number;
  state: string;
  area_name: string;
  bachelorsOrHigher: number;
}
interface CountyData {
  type: "Topology";
  objects: { counties: any; states: any };
  arcs: any[];
  transform: any;
}

export default function DealFlowPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFips, setSelectedFips] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isStandalone = pathname === "/turfwars";

  useLayoutEffect(() => {
    if (isStandalone) {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isStandalone]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
      return;
    }

    (async () => {
      const EDUCATION_URL =
        "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json";
      const COUNTY_URL =
        "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json";

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

      const VIEWBOX_W = 975;
      const VIEWBOX_H = 610;
      const path = d3.geoPath();
      const maxEd = d3.max(educationData, (d) => d.bachelorsOrHigher)!;

      d3.select("#graph").selectAll("*").remove();

      const svg = d3
        .select("#graph")
        .append("svg")
        .attr("viewBox", `0 0 ${VIEWBOX_W} ${VIEWBOX_H}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("width", "840px")
        .style("height", "auto")
        .style("display", "block");

      const tooltip = d3
        .select("#tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", "beige")
        .style("color", "black")
        .style("padding", "6px")
        .style("border-radius", "4px");

      svg
        .selectAll("path.county")
        .data(counties.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "county")
        .attr("data-fips", (d: any) => d.id?.toString() ?? "")
        .style("stroke", "grey")
        .style("stroke-width", "0.5px")
        .style("fill", (d: any) => {
          const t = educationData.find((e) => e.fips === d.id);
          return t
            ? d3.interpolateRdYlBu(1 - t.bachelorsOrHigher / maxEd)
            : "beige";
        })
        .on("mouseover", (evt: MouseEvent, d: any) => {
          const t = educationData.find((e) => e.fips === d.id);
          if (!t) return;
          d3.select(evt.currentTarget as SVGPathElement)
            .style("stroke", "black")
            .style("stroke-width", 0.9);
          tooltip
            .html(
              `${t.area_name}, ${t.state}<br/>Price Ꞙ ${t.bachelorsOrHigher.toFixed(
                2
              )}`
            )
            .style("left", `${evt.pageX + 15}px`)
            .style("top", `${evt.pageY - 50}px`)
            .style(
              "background",
              d3.interpolateRdYlBu(1 - t.bachelorsOrHigher / maxEd)
            )
            .style("opacity", 0.9);
        })
        .on("mouseout", (evt: MouseEvent) => {
          d3.select(evt.currentTarget as SVGPathElement)
            .style("stroke", "grey")
            .style("stroke-width", 0.5);
          tooltip.style("opacity", 0);
        })
        .on("click", (_evt: MouseEvent, d: any) => {
          const t = educationData.find((e) => e.fips === d.id);
          if (t) {
            setSelectedFips(d.id.toString());
            setSelectedCounty(`${t.area_name}, ${t.state}`);
            setModalOpen(true);
          }
        });

      svg
        .append("path")
        .datum(states)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-linejoin", "round")
        .attr("d", path as any);
    })();
  }, []);

  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white text-center px-4 py-10">
        <h1 className="text-xl font-semibold mb-4">📱 Not available on mobile</h1>
        <p className="text-sm text-gray-400 mb-6">
          Please open the Deal Flow dashboard on a desktop device.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-cyan-600 rounded hover:bg-cyan-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0B1519] text-white flex flex-col items-center">
      <div id="tooltip" className="absolute z-50 pointer-events-none" />
      <div
        id="graph"
        className="flex justify-center items-center mt-18 mb-12 w-full max-w-[1000px] mx-auto"
      />
      <FIPSModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fipsCode={selectedFips}
        countyName={selectedCounty}
      />
    </div>
  );
}
