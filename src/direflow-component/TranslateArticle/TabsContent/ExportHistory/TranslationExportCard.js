import React from "react";
import {
  Card,
  Dropdown,
  Button,
  Progress,
  Icon,
  Popup,
} from "semantic-ui-react";
import moment from "moment";
import Avatar from "react-avatar";

import ProgressButton from "../../components/ProgressButton";
import VideoPlayer from "../../components/VideoPlayer";
import fileUtils from "../../utils/fileUtils";
import { getUserNamePreview } from "../../utils/helpers";
import checkboxGreen from "./checkbox-ticked-green.png";
import checkboxOrange from "./checkbox-ticked-orange.png";

function renderLabel(text) {
  return (
    <p>
      <Icon name="check" color="green" /> {text}
    </p>
  );
}

function renderInfoRow({ title, user, users }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        // flexDirection: "column",
        alignItems: "center",
        marginBottom: "1rem",
      }}
    >
      <p style={{ margin: 0 }}>{title}</p>
      <div>
        {user ? (
          <Popup
            content={getUserNamePreview(user)}
            trigger={
              <div style={{ marginLeft: 10 }}>
                <Avatar name={getUserNamePreview(user)} size={30} round />
              </div>
            }
          />
        ) : (
          users.map((u) => (
            <Popup
              key={`translation_by-${u.email}`}
              content={getUserNamePreview(u)}
              trigger={
                <div style={{ marginLeft: 10 }}>
                  <Avatar name={getUserNamePreview(u)} size={30} round />
                </div>
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
export default class TranslationExportCard extends React.Component {
    
  renderUserAvatar = (translator, extra) => {
    const { users } = this.props;
    if (!translator || !users) return null;
    if (typeof translator === "string") {
      translator = users[translator];
    } else {
      translator = users[translator.user];
    }
    if (!translator) return null;
    const translatorName = translator.firstname
      ? `${translator.firstname} ${translator.lastname || ""}`
      : translator.email;

    return (
      <Popup
        content={
          <div>
            <div style={{ color: "#333333", fontSize: 12 }}>
              {translatorName}
            </div>
            <small style={{ color: "#666666", fontSize: 10 }}>{extra}</small>
          </div>
        }
        trigger={
          <span>
            <Avatar
              round
              size={25}
              name={translatorName}
              style={{ margin: "5px 5px", display: "inline-block" }}
            />
          </span>
        }
      />
    );
  };

  renderDownloadDropdown = () => {
    const { translationExport, canGenerateSignLanguage } = this.props;
    if (translationExport.status !== "done") return;

    return (
      <Dropdown
        icon={null}
        pointing
        trigger={
          <Button basic primary circular>
            Download <Icon name="chevron down" style={{ paddingLeft: 10 }} />
          </Button>
        }
      >
        <Dropdown.Menu style={{ color: "black !important", minWidth: 200 }}>
          <Dropdown.Item
            as={"a"}
            style={{ color: "black" }}
            href={`${translationExport.videoUrl}?download`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Video
            <Icon
              style={{ marginLeft: 10 }}
              name="check circle outline"
              color="green"
            />
          </Dropdown.Item>

          {translationExport.subtitledVideoUrl ? (
            <Dropdown.Item
              as={"a"}
              style={{ color: "black" }}
              href={`${translationExport.subtitledVideoUrl}?download`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Video + Subtitles
              <Icon
                style={{ marginLeft: 10 }}
                name="check circle outline"
                color="green"
              />
            </Dropdown.Item>
          ) : (
            <Dropdown.Item
              onClick={(e) => {
                e.stopPropagation();
                if (!translationExport.subtitledVideoUrl) {
                  this.props.onGenerateTranslationExportSubtitledVideo(
                    translationExport._id
                  );
                } else {
                  fileUtils.downloadFile(translationExport.subtitledVideoUrl);
                }
              }}
            >
              <ProgressButton
                onClick={() => {}}
                percent={translationExport.subtitledVideoProgress}
                showProgress={translationExport.subtitledVideoProgress > 0}
                text="Video + Subtitles"
              />
            </Dropdown.Item>
          )}

          {canGenerateSignLanguage ? (
            translationExport.subtitledSignlanguageVideoUrl ? (
              <Dropdown.Item
                as={"a"}
                style={{ color: "black" }}
                href={`${translationExport.subtitledSignlanguageVideoUrl}?download`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Video + Subtitles + Sign language
                <Icon
                  style={{ marginLeft: 10 }}
                  name="check circle outline"
                  color="green"
                />
              </Dropdown.Item>
            ) : (
              <Dropdown.Item
                onClick={(e) => {
                  e.stopPropagation();
                  if (!translationExport.subtitledSignlanguageVideoUrl) {
                    this.props.onGenerateTranslationExportSubtitledSignLanguage(
                      translationExport._id
                    );
                  } else {
                    fileUtils.downloadFile(
                      translationExport.subtitledSignlanguageVideoUrl
                    );
                  }
                }}
              >
                <ProgressButton
                  onClick={() => {}}
                  percent={translationExport.subtitledSignlanguageVideoProgress}
                  showProgress={
                    translationExport.subtitledSignlanguageVideoProgress > 0
                  }
                  text="Video + Subtitles + Sign Language"
                />
              </Dropdown.Item>
            )
          ) : null}

          {translationExport.subtitleUrl ? (
            <Dropdown.Item
              as={"a"}
              style={{ color: "black" }}
              href={`${translationExport.subtitleUrl}?download`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Subtitles
              <Icon
                style={{ marginLeft: 10 }}
                name="check circle outline"
                color="green"
              />
            </Dropdown.Item>
          ) : (
            <Dropdown.Item
              onClick={(e) => {
                e.stopPropagation();
                if (!translationExport.subtitleUrl) {
                  this.props.onGenerateTranslationExportSubtitle(
                    translationExport._id
                  );
                  // this.props.generateTranslationExportSubtitledVideo(translationExport._id);
                } else {
                  fileUtils.downloadFile(translationExport.subtitleUrl);
                }
              }}
            >
              <ProgressButton
                onClick={() => {}}
                percent={translationExport.subtitleProgress}
                showProgress={translationExport.subtitleProgress > 0}
                text="Subtitles"
              />
            </Dropdown.Item>
          )}
          {translationExport.audiosArchiveUrl ? (
            <Dropdown.Item
              as="a"
              style={{ color: "black" }}
              href={`${translationExport.audiosArchiveUrl}?download`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Audios
              <Icon
                style={{ marginLeft: 10 }}
                name="check circle outline"
                color="green"
              />
            </Dropdown.Item>
          ) : (
            <Dropdown.Item
              onClick={(e) => {
                e.stopPropagation();
                if (!translationExport.audiosArchiveUrl) {
                  this.props.onGenerateTranslationExportAudioArchive(
                    translationExport._id
                  );
                } else {
                  fileUtils.downloadFile(translationExport.audiosArchiveUrl);
                }
              }}
            >
              <ProgressButton
                percent={translationExport.audiosArchiveProgress}
                showProgress={translationExport.audiosArchiveProgress > 0}
                text="Audios"
              />
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  render() {
    const { translationExport, canApprove, textTranslators, translators, verifiers, thumbnail } = this.props;
    return (
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            fontSize: "1rem",
            top: "-0.8rem",
            right: "46%",
            zIndex: 1,
          }}
        >
          {translationExport.status === "done" && <img src={checkboxGreen} />}
          {(translationExport.exportRequestStatus === "pending" ||
            translationExport.status === "pending") && (
            <img src={checkboxOrange} />
          )}

          {(translationExport.exportRequestStatus === "declined" ||
            translationExport.status === "failed") && (
            <Icon
              size="large"
              style={{
                backgroundColor: "white",
                borderRadius: 10,
                backgroundColor: "red",
                color: "white",
              }}
              name="close circle"
            />
          )}
        </div>
        <Card fluid style={{ borderRadius: 16 }}>
          <div
            style={{
              opacity:
                translationExport.exportRequestStatus === "approved" &&
                translationExport.status === "processing"
                  ? 0.3
                  : 1,
            }}
          >
            <VideoPlayer
              src={translationExport.videoUrl}
              thumbnail={thumbnail}
            />

            <div style={{ padding: "1rem", paddingBottom: 0 }}>
              {translationExport.exportRequestStatus === "approved" &&
                translationExport.version && (
                  <h3 style={{ textTransform: "capitalize", marginBottom: 0 }}>
                    Version: {translationExport.version}.
                    {translationExport.subVersion}
                    {translationExport.status === "done" && (
                      <Popup
                        content={
                          <div>
                            {translationExport.cancelNoise &&
                              renderLabel("ML Background Noise Cancellation")}
                            {translationExport.normalizeAudio &&
                              renderLabel("Audio Mastering")}
                            {renderLabel(
                              `Vocal Level: ${translationExport.voiceVolume}x`
                            )}
                            {translationExport.backgroundMusicTransposed &&
                              renderLabel(`ML Background Music Transpose`)}
                            {translationExport.hasBackgroundMusic &&
                              renderLabel(
                                `Background Music Level: ${translationExport.backgroundMusicVolume}x`
                              )}
                          </div>
                        }
                        trigger={
                          <Button
                            icon="music"
                            circular
                            basic
                            className="pull-right"
                          />
                        }
                      />
                    )}
                  </h3>
                )}
              {translationExport.status === "done" ? (
                ""
              ) : (
                <h3 style={{ textTransform: "capitalize", marginBottom: 0 }}>
                  <strong>Status: </strong>
                  {translationExport.exportRequestStatus === "declined" && (
                    <span>Declined</span>
                  )}
                  {translationExport.exportRequestStatus === "pending" && (
                    <span style={{ color: "#f99d25" }}>Pending</span>
                  )}
                  {translationExport.exportRequestStatus === "approved" &&
                  translationExport.status !== "done"
                    ? translationExport.status
                    : ""}

                  {translationExport.exportRequestStatus === "pending" && (
                    <Button
                      icon="music"
                      circular
                      basic
                      className="pull-right"
                      onClick={() =>
                        this.props.onOpenTranslationExportSettings(
                          translationExport
                        )
                      }
                    />
                  )}
                </h3>
              )}

              <div style={{ color: "#999999" }}>
                <p>
                  <small>
                    {moment(translationExport.created_at).format(
                      "DD MMM YYYY hh:mm a"
                    )}
                  </small>
                </p>
                <div
                  style={{
                    display: "flex",
                    // alignItems: "center",
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    // justifyContent: "center",
                  }}
                >
                  {translationExport.exportRequestBy &&
                    renderInfoRow({
                      title: "Exported by",
                      user: translationExport.exportRequestBy,
                    })}
                  {translationExport.approvedBy &&
                    renderInfoRow({
                      title: "Approved by",
                      user: translationExport.approvedBy,
                    })}
                  {translationExport.declinedBy &&
                    renderInfoRow({
                      title: "Declined by",
                      user: translationExport.declinedBy,
                    })}
                  {/* {translationExport.translationBy &&
                    renderInfoRow({
                      title: "Translated By",
                      users: translationExport.translationBy,
                    })} */}
                </div>
              </div>
            </div>
            <div style={{ marginLeft: "1rem", color: '#999999' }}>
              <div style={{ marginBottom: 10 }}>Contributors:</div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {/* Text Translators */}
                  {textTranslators &&
                    textTranslators.length > 0 &&
                    textTranslators.map((translator, index) => (
                      <span key={`translator-${translator.user}`}>
                        {this.renderUserAvatar(translator, "Translator")}
                      </span>
                    ))}
                  {textTranslators &&
                    textTranslators.length > 0 &&
                    ((translators && translators.length > 0) ||
                      (verifiers && verifiers.length > 0)) && (
                      <span
                        style={{
                          width: 1,
                          height: "2rem",
                          border: "1px solid #979797",
                          opacity: 0.3,
                        }}
                      ></span>
                    )}
                  {translators &&
                    translators.length > 0 &&
                    translators.map((translator) => (
                      <span key={`voice-over-artist-${translator.user}`}>
                        {this.renderUserAvatar(
                          translator,
                          <span>
                            Voice-over artist
                            {/* <div>Invitation: {translator.invitationStatus || 'pending'}</div> */}
                          </span>
                        )}
                      </span>
                    ))}
                  {translators &&
                    translators.length > 0 &&
                    verifiers &&
                    verifiers.length > 0 && (
                      <span
                        style={{
                          width: 1,
                          height: "2rem",
                          border: "1px solid #979797",
                          opacity: 0.3,
                        }}
                      ></span>
                    )}
                  {verifiers &&
                    verifiers.length > 0 &&
                    verifiers.map((verifier) => (
                      <span key={`approver-${verifier}`}>
                        {this.renderUserAvatar(verifier, "Approver")}
                      </span>
                    ))}
                  {/* Separator if there's text translators and  */}
                </div>
            </div>
            {translationExport.status === "done" && (
              <div style={{ margin: 15 }}>{this.renderDownloadDropdown()}</div>
            )}
            {canApprove && translationExport.exportRequestStatus === "pending" && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  padding: "1rem",
                }}
              >
                <Button
                  color="red"
                  circular
                  onClick={() => this.props.onDeclineRequest(translationExport)}
                >
                  Decline
                </Button>
                <Button
                  color="green"
                  circular
                  onClick={() => this.props.onApproveRequest(translationExport)}
                >
                  Approve
                </Button>
              </div>
            )}
            {/* {translationExport.exportRequestStatus === 'approved' && translationExport.status === 'processing' && (
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 3, backgroundColor: '' }} />
                        )} */}
          </div>

          {translationExport.exportRequestStatus === "approved" &&
            translationExport.status === "processing" && (
              <div style={{ margin: 20, marginTop: 10 }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <h3>Exporting...</h3>
                  <span style={{ color: "#0e7ceb", fontWeight: "bold" }}>
                    {translationExport.progress}%
                  </span>
                </div>
                <Progress
                  color="blue"
                  size="tiny"
                  percent={translationExport.progress}
                />
                <p
                  style={{
                    color: "#999999",
                    fontSize: 10,
                    marginBottom: "1rem",
                  }}
                >
                  We are making this video downloadable for you. Do not reload
                  the page.
                </p>
              </div>
            )}
        </Card>
      </div>
    );
  }
}
