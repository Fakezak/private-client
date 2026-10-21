using UnityEngine;
using UnityEngine.Networking;
using System.Collections;

public class VercelLoader : MonoBehaviour
{
    public string serverUrl = "https://private-client-ten.vercel.app/id";

    void Start() { StartCoroutine(LoginToServer()); }

    IEnumerator LoginToServer()
    {
        string playerId = SystemInfo.deviceUniqueIdentifier; 
        string fullUrl = serverUrl + "?id=" + playerId;

        using (UnityWebRequest webRequest = UnityWebRequest.Get(fullUrl))
        {
            yield return webRequest.SendWebRequest();

            if (webRequest.result == UnityWebRequest.Result.Success)
            {
                string responseText = webRequest.downloadHandler.text;
                string serverJson = webRequest.GetResponseHeader("Server");

                if (responseText == "OK" && !string.IsNullOrEmpty(serverJson))
                {
                    ModData data = JsonUtility.FromJson<ModData>(serverJson);
                    
                    // Apply Cheats
                    PlayerPrefs.SetFloat("XP_Multiplier", data.mods.xp);
                    Debug.Log("Speed: " + data.mods.speed);
                    
                    // Show Green Message
                    Debug.Log("<color=green>" + data.msg + "</color>");
                }
            }
        }
    }
}

[System.Serializable]
public class ModData { public string msg; public Mods mods; }
[System.Serializable]
public class Mods { public float xp; public float speed; public bool noRecoil; public bool unlimitedAmmo; }
