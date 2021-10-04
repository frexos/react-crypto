import React from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { fetchCoinDetails } from '../actions';
import CoinChart from './CoinChart';

import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import bfIcon from '../styles/icons/fb.svg';
import twIcon from '../styles/icons/tw.svg';
import githubIcon from '../styles/icons/github.svg';
import backIcon from '../styles/icons/back.svg';
import upvoteIcon from '../styles/icons/upvote.svg';
import downvoteIcon from '../styles/icons/downvote.svg';

class CoinDetailsView extends React.Component {


    componentDidMount() {
        this.props.fetchCoinDetails(this.props.match.params.id);
    }

    render() {
        const coin = this.props.coin

        const renderDevMeta = (meta) => {

            const renderMeta = () => {
                return(
                    meta.map(( (m, index) => {
                        if (m) {
                            return (
                                <div key={index}>
                                    <span>{m.name}: {m.value}</span>
                                </div>
                            )
                        }
                    }))
                )
            }

            return(
                <div>
                    <img src={githubIcon} className="devstats-icon" />
                    {renderMeta(meta)}
                </div>
            )

        }

        const renderReputation = (upvotes, downvotes) => {

            if (upvotes || downvotes) {

                return (
                    <Grid item xs={6} md={3}>
                        <div className="reputation-wrapper">
                            <img className="reputation-icon" src={upvoteIcon} />                    
                            <p className="social-stat">{upvotes}</p>
                        </div>
                        <div className="reputation-wrapper">
                            <img className="reputation-icon" src={downvoteIcon} />                    
                            <p className="social-stat">{downvotes}</p>
                        </div>
                    </Grid>
                )
            }
        }
        
        const renderSocial = (icon, datum, stats) => {            
            
            const icons = {
                fb: {
                    icon: bfIcon,
                    stat: 'likes'
                },
                tw: {
                    icon: twIcon,
                    stat: 'followers'
                }
            }

            if (stats) {
                return (
                    <Grid item xs={6} md={3}>
                        <a href={datum}>
                            <img className={`social-icon ${icon}`} src={icons[icon].icon} />
                        </a>
                        <p className="social-stat">{icons[icon].stat}: {stats}</p>
                    </Grid>
                )
            } else {
                return (
                    <Grid item xs={6} md={3}>
                        <a href={datum}>
                            <img className={`social-icon ${icon}`} src={icons[icon].icon} />
                        </a>
                    </Grid>
                );
            }

        }

        const renderDatum = (title, datum) => {


            if (!datum || datum==='') return;    

            return (
                <Grid item xs={6} md={3}>
                    <h4 className="datum-title">{title}</h4>
                    <div className="datum-body">{datum}</div>
                </Grid>
            )    
            

        }

        const renderDescription = (desc) => {
            return (
                <Grid item xs={12}>                        
                    <div  className="description-wrapper" dangerouslySetInnerHTML={{ __html: desc }}>
                    </div> 
                </Grid>
            )
        }

        const renderLink = (title, link) => {
            if (link) {
                return (
                    <Grid item xs={12} md={4}>
                        <span><h4>{title}</h4><a href={link}>{link}</a></span>
                    </Grid>
    
                
                )
            }
        }

        if(!coin) {
            return (
                <Paper>
                    <CircularProgress />
                </Paper>
            );
        }        

        console.log('coin', coin)

        const renderImage = (image) => {
            if (image) {
                return (
                    <img className="coin-image" src={image} /> 
                );
            }
        };

        return (
            <div className="coin-details">
                <div className="details-header">
                    {renderImage(coin.image.large)}
                    <h1>{coin.name}</h1>
                </div>
                <Paper className="market coin-container">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <CoinChart cid={coin.id}/>
                        </Grid>
                        <Grid item xs={12}>
                            <h1 className="section-title">Market Data</h1>
                        </Grid>
                        {renderDatum('current price', `$${coin.market_data.current_price['usd']}`)}
                        {renderDatum('Price change 24hr', `${coin.market_data.price_change_24h_in_currency['usd']}`)}
                        {renderDatum('Price change 7d', `${coin.market_data.price_change_percentage_7d_in_currency['usd']}`)}
                        {renderDatum('Price change 14d', `${coin.market_data.price_change_percentage_14d_in_currency['usd']}`)}
                        {renderDatum('Price change 1m', `${coin.market_data.price_change_percentage_30d_in_currency['usd']}`)}
                        {renderDatum('Price change 2m', `${coin.market_data.price_change_percentage_60d_in_currency['usd']}`)}
                        {renderDatum('Price change 200d', `${coin.market_data.price_change_percentage_200d_in_currency['usd']}`)}
                        {renderDatum('Price change 1y', `${coin.market_data.price_change_percentage_1y_in_currency['usd']}`)}
                        {renderDatum('ath', `$${coin.market_data.ath['usd']}`)}
                        {renderDatum('ath date', `$${coin.market_data.ath_date['usd']}`)}
                        {renderDatum('atl', `$${coin.market_data.atl['usd']}`)}
                        {renderDatum('atl date', `$${coin.market_data.atl_date['usd']}`)}
                        {renderDatum('High 24h', `$${coin.market_data.high_24h['usd']}`)}
                        {renderDatum('Low 24h', `$${coin.market_data.low_24h['usd']}`)}
                    </Grid>
                </Paper>
                <Paper className="about coin-container">
                    <Grid item xs={12}>
                            <h1 className="section-title">About</h1>
                    </Grid>
                    <Grid container spacing={2}>
                        {renderDescription(coin.description['en'])}                        
                        {renderSocial('fb',  `https://www.facebook.com/{coin.links.facebook_username}`, coin.community_data.facebook_likes)}
                        {renderSocial('tw',  `https://twitter.com/{coin.links.twitter_screen_name}`, coin.community_data.twitter_followers)}
                        {renderReputation(coin.sentiment_votes_up_percentage, coin.sentiment_votes_down_percentage)}

                        {renderDevMeta([
                            {name: 'forks', value: coin.developer_data.forks},
                            {name: 'stars', value: coin.developer_data.stars},
                            {name: 'subscribers', value: coin.developer_data.subscribers},
                            {name: 'issues', value: coin.developer_data.total_issues},
                        ])}
                        {renderLink('Homepage', coin.links.homepage[0])}
                        {renderLink('Official forum', coin.links.official_forum_url[0])}
                        {renderLink('Chat', coin.links.chat_url[0])}

                        
                        
                        
                    </Grid>
                </Paper>
                <Link to={`/`} className="link-container" title="Return to list of coins">
                    <img className="link-back" src={backIcon} />
                </Link>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
            coin: state.selectedCoin[ownProps.match.params.id]
        }
}

export default connect(mapStateToProps, { fetchCoinDetails })(CoinDetailsView);