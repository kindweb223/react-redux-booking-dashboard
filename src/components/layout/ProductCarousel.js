import React, { useEffect, useState } from "react";
import styled from "styled-components";
import colors from "../style/colors";

const CarouselWrapper = styled.div`
  max-width: 100%;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;
  position: sticky;
  top: 0;
  @media (max-width: 960px) {
    position: relative;
    height: auto;
  }
`;

const CarouselView = styled.div`
  position: relative;
  width: 100%;
  height: 46em;
  max-height: 80%;

  @media (max-width: 640px) {
    height: 30em;
    max-height: 80vh;
  }

  > div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    /* transition: opacity 0.3s; */
    &.current {
      /* transition: opacity 0.25s; */
      opacity: 1;
    }
    .gatsby-image-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 300%;
      height: 100%;
      overflow: visible !important;
      div {
        pointer-events: none;
      }
      img {
        box-shadow: 0px 6px 60px -13px rgba(0, 0, 0, 0.25);
        border-radius: 0.6em;
        object-fit: contain !important;
        top: 0 !important;
        left: 0 !important;
        height: 100% !important;
        width: auto !important;
      }
    }
  }
`;

const CarouselControls = styled.ul`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  /* padding: 1.8em; */
  margin: 0;
  li {
    display: inline-block;
    padding: 1.6em 0.5em;
    > div {
      width: 9px;
      height: 9px;
      background: ${colors.light};
      border-radius: 50%;
    }
    :first-child {
      margin-left: 0;
    }
    cursor: pointer;
    &.current {
      > div {
        background: ${colors.dark};
      }
    }
  }
  @media (max-width: 960px) {
    text-align: center;
    justify-content: center;
    padding: 1.5em 0 0;
  }
`;

const FadeCarousel = props => {
  const { forcedPage } = props;

  const [currentPage, setCurrentPage] = useState(null);

  useEffect(() => {
    setCurrentPage(0);
  }, []);

  useEffect(() => {
    if (forcedPage < props.children.length) {
      setCurrentPage(forcedPage);
    }
  }, [forcedPage]);

  function nextPage() {
    if (currentPage == props.children.length - 1) {
      setCurrentPage(0);
    } else {
      setCurrentPage(currentPage + 1);
    }
  }

  return (
    <CarouselWrapper>
      <CarouselView id="carousel">
        {props.children.map((child, index) => (
          <div
            key={index}
            className={index == currentPage ? "current" : ""}
            onClick={() => {
              nextPage();
            }}
          >
            {child}
          </div>
        ))}
      </CarouselView>
      <CarouselControls currentPage={currentPage}>
        {props.children.map((child, index) => (
          <li
            key={index}
            index={index}
            className={index == currentPage ? "current" : ""}
            onClick={() => {
              setCurrentPage(index);
            }}
          >
            <div />
          </li>
        ))}
      </CarouselControls>
    </CarouselWrapper>
  );
};

export default FadeCarousel;
