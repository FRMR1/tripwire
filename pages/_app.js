import React, { createContext } from "react";
import { ApolloProvider } from "@apollo/client";
import { withUseApollo } from "../util/hoc/withUseApollo";
import App from "next/app";
import Head from "next/head";
import NProgress from "nprogress";
import { withRouter } from "next/router";
import ContextProvider from "../context/context";
import ThemeProvider from "../util/themeProvider";
import "../styles/globals.css";
import "react-toggle/style.css";
import "mapbox-gl/dist/mapbox-gl.css";

export const LoadingContext = createContext(false);

class Tripwire extends App {
    state = {
        isLoading: false,
    };

    componentDidMount() {
        this.props.router.events.on("routeChangeStart", (url) => {
            NProgress.start();
            this.setState({ isLoading: true });
        });
        this.props.router.events.on("routeChangeComplete", () => {
            NProgress.done();
            this.setState({ isLoading: false });
        });
        this.props.router.events.on("routeChangeError", () => {
            NProgress.done();
            this.setState({ isLoading: false });
        });
    }

    setIsLoading = (isLoading) => {
        this.setState({ isLoading });
    };

    render() {
        const { Component, pageProps } = this.props;

        return (
            <>
                <Head>
                    <title>Tripwire</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <ApolloProvider client={this.props.apolloClient}>
                    <LoadingContext.Provider
                        value={{
                            isLoading: this.state.isLoading,
                            setIsLoading: this.setIsLoading,
                        }}
                    >
                        <ContextProvider>
                            <ThemeProvider>
                                <Component {...pageProps} />
                            </ThemeProvider>
                        </ContextProvider>
                    </LoadingContext.Provider>
                </ApolloProvider>
            </>
        );
    }
}

export default withUseApollo(withRouter(Tripwire));
